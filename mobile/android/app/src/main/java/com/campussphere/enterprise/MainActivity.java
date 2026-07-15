package com.campussphere.enterprise;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.net.ConnectivityManager;
import android.net.Network;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceError;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://campussphere-sigma.vercel.app/";
    private static final int FILE_CHOOSER_REQUEST = 7001;

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout loadingView;
    private TextView offlineView;
    private Button retryButton;
    private ValueCallback<Uri[]> filePathCallback;
    private long lastBackPressedAt = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        buildLayout();
        configureWebView();
        loadApp();
    }

    private void buildLayout() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(248, 250, 252));

        webView = new WebView(this);
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        loadingView = new LinearLayout(this);
        offlineView = new TextView(this);
        retryButton = new Button(this);

        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);

        loadingView.setGravity(Gravity.CENTER);
        loadingView.setOrientation(LinearLayout.VERTICAL);
        loadingView.setPadding(40, 40, 40, 40);
        loadingView.setBackgroundColor(Color.rgb(251, 250, 248));

        TextView logo = new TextView(this);
        logo.setText("CampusSphere");
        logo.setTextColor(Color.rgb(249, 115, 22));
        logo.setTextSize(26);
        logo.setGravity(Gravity.CENTER);
        logo.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);

        TextView subtitle = new TextView(this);
        subtitle.setText("Opening your enterprise campus portal...");
        subtitle.setTextColor(Color.rgb(91, 101, 119));
        subtitle.setTextSize(15);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 12, 0, 22);

        ProgressBar spinner = new ProgressBar(this);
        loadingView.addView(logo);
        loadingView.addView(subtitle);
        loadingView.addView(spinner);

        offlineView.setText("CampusSphere cannot connect right now.\nCheck your internet connection and try again.");
        offlineView.setTextColor(Color.rgb(15, 23, 42));
        offlineView.setTextSize(16);
        offlineView.setGravity(Gravity.CENTER);
        offlineView.setPadding(36, 36, 36, 150);
        offlineView.setVisibility(View.GONE);

        retryButton.setText("Retry");
        retryButton.setTextColor(Color.WHITE);
        retryButton.setBackgroundColor(Color.rgb(249, 115, 22));
        retryButton.setVisibility(View.GONE);
        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                loadApp();
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        root.addView(progressBar, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            8,
            Gravity.TOP
        ));
        root.addView(loadingView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        root.addView(offlineView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        FrameLayout.LayoutParams retryParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT,
            Gravity.CENTER
        );
        retryParams.topMargin = 170;
        root.addView(retryButton, retryParams);

        setContentView(root);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri == null) return false;
                String scheme = uri.getScheme();
                String host = uri.getHost();
                if ("tel".equals(scheme) || "mailto".equals(scheme) || (host != null && !host.contains("campussphere-sigma.vercel.app") && !host.contains("campussphere-i8c7.onrender.com"))) {
                    openExternal(uri);
                    return true;
                }
                view.loadUrl(uri.toString());
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript("document.documentElement.classList.add('android-webview')", null);
                offlineView.setVisibility(View.GONE);
                retryButton.setVisibility(View.GONE);
                loadingView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    showOffline();
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePath, FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = filePath;
                Intent intent = params != null ? params.createIntent() : new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                } catch (ActivityNotFoundException error) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "No file picker available.", Toast.LENGTH_LONG).show();
                    return false;
                }
                return true;
            }
        });
    }

    private void loadApp() {
        if (isOnline()) {
            loadingView.setVisibility(View.VISIBLE);
            offlineView.setVisibility(View.GONE);
            retryButton.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl(APP_URL);
        } else {
            showOffline();
        }
    }

    private void showOffline() {
        webView.setVisibility(View.GONE);
        loadingView.setVisibility(View.GONE);
        progressBar.setVisibility(View.GONE);
        offlineView.setVisibility(View.VISIBLE);
        retryButton.setVisibility(View.VISIBLE);
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "Unable to open this link.", Toast.LENGTH_SHORT).show();
        }
    }

    private boolean isOnline() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        Network network = manager != null ? manager.getActiveNetwork() : null;
        return network != null;
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        long now = System.currentTimeMillis();
        if (now - lastBackPressedAt < 1800) {
            super.onBackPressed();
            return;
        }
        lastBackPressedAt = now;
        Toast.makeText(this, "Press back again to exit CampusSphere.", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || filePathCallback == null) {
            return;
        }
        Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
