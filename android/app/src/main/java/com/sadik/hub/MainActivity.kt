package com.sadik.hub

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import androidx.webkit.WebViewAssetLoader

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var fullscreenContainer: FrameLayout

    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    private var backPressedTime: Long = 0L

    // File chooser launcher for file uploads
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (filePathCallback != null) {
            val results = if (result.resultCode == RESULT_OK) {
                result.data?.let { data ->
                    val clipData = data.clipData
                    if (clipData != null) {
                        Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
                    } else {
                        data.data?.let { arrayOf(it) }
                    }
                }
            } else null
            filePathCallback?.onReceiveValue(results)
            filePathCallback = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        fullscreenContainer = findViewById(R.id.fullscreenContainer)

        setupSwipeRefresh()
        setupWebView()
        setupBackNavigation()

        // Load entry point
        webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
    }

    private fun setupSwipeRefresh() {
        swipeRefresh.setColorSchemeColors(
            getColor(R.color.accent_primary),
            getColor(R.color.bg_surface)
        )
        swipeRefresh.setProgressBackgroundColorSchemeColor(getColor(R.color.bg_base))

        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }

        // Enable pull-to-refresh only when at the top of scroll
        webView.viewTreeObserver.addOnScrollChangedListener {
            swipeRefresh.isEnabled = (webView.scrollY == 0)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = false
        settings.allowFileAccess = false
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.isVerticalScrollBarEnabled = false
        webView.isHorizontalScrollBarEnabled = false

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url.toString()

                // Special external URI schemes
                if (url.startsWith("tel:") ||
                    url.startsWith("mailto:") ||
                    url.startsWith("sms:") ||
                    url.startsWith("whatsapp:") ||
                    url.startsWith("market:")
                ) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        return false
                    }
                }

                // If loading internal asset app, keep inside WebView
                if (url.startsWith("https://appassets.androidplatform.net/")) {
                    return false
                }

                // For external websites (e.g. Madhyamam, Facebook, YouTube, etc.)
                // Allow them to navigate within WebView or in workspace iframe
                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress >= 100) {
                    progressBar.visibility = View.GONE
                } else {
                    progressBar.visibility = View.VISIBLE
                }
            }

            // File chooser support
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }

                try {
                    fileChooserLauncher.launch(intent)
                    return true
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    return false
                }
            }

            // Fullscreen video/content support
            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customView != null) {
                    onHideCustomView()
                    return
                }
                customView = view
                customViewCallback = callback
                fullscreenContainer.addView(view)
                fullscreenContainer.visibility = View.VISIBLE
                webView.visibility = View.GONE
            }

            override fun onHideCustomView() {
                if (customView == null) return
                fullscreenContainer.removeView(customView)
                fullscreenContainer.visibility = View.GONE
                customView = null
                customViewCallback?.onCustomViewHidden()
                webView.visibility = View.VISIBLE
            }
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // 1. If in fullscreen custom view, exit fullscreen
                if (customView != null) {
                    (webView.webChromeClient as? WebChromeClient)?.onHideCustomView()
                    return
                }

                // 2. Check if embedded workspace is open and can be closed/reset
                webView.evaluateJavascript(
                    """
                    (function() {
                        const frame = document.getElementById('workspace-frame');
                        const art = document.getElementById('default-art-card');
                        const container = document.querySelector('.workspace-window');
                        if (container && container.classList.contains('expanded')) {
                            container.classList.remove('expanded');
                            return 'handled_collapse';
                        }
                        if (frame && frame.style.display !== 'none' && frame.src) {
                            frame.style.display = 'none';
                            if (art) art.style.display = 'block';
                            frame.src = '';
                            return 'handled_workspace';
                        }
                        return 'none';
                    })();
                    """.trimIndent()
                ) { result ->
                    val cleanResult = result?.replace("\"", "") ?: ""
                    if (cleanResult.startsWith("handled")) {
                        // Successfully handled collapse or closing workspace
                        return@evaluateJavascript
                    }

                    // 3. If webView history can go back
                    if (webView.canGoBack()) {
                        webView.goBack()
                        return@evaluateJavascript
                    }

                    // 4. Double press back to exit app
                    if (System.currentTimeMillis() - backPressedTime < 2000) {
                        finish()
                    } else {
                        backPressedTime = System.currentTimeMillis()
                        Toast.makeText(this@MainActivity, "Press back again to exit", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
