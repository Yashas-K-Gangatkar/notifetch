package com.notifetch.app.ui.components

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Shader
import android.util.AttributeSet
import android.view.View
import android.view.animation.LinearInterpolator

/**
 * AnimatedGradientView — a battery-friendly animated app background.
 *
 * Paints a single rectangle with a LinearGradient shader and slowly
 * translates it, looping seamlessly. No video decoder, no bitmap frames,
 * no external library — just one drawRect() per frame on the GPU-backed
 * hardware layer.
 *
 * XML usage:
 *   <com.notifetch.app.ui.components.AnimatedGradientView
 *       android:layout_width="match_parent"
 *       android:layout_height="match_parent" />
 *
 * Lifecycle (saves the remaining battery by not animating off-screen):
 *   override fun onPause() { super.onPause(); gradientView.pause() }
 *   override fun onResume() { super.onResume(); gradientView.resume() }
 */
class AnimatedGradientView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    // NotiFetch brand colors: Navy (#102F4B) and Coral (#EE9C81)
    private val colors = intArrayOf(
        Color.parseColor("#102F4B"), // navy
        Color.parseColor("#EE9C81"), // coral
        Color.parseColor("#102F4B")  // repeats the first color -> seamless loop
    )

    /** How long one full gradient cycle takes. */
    var durationMs: Long = 6000L

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var animator: ValueAnimator? = null
    private var offset = 0f

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w <= 0 || h <= 0) return

        // The gradient spans 3x the width, so translating it by up to `w`
        // never reveals a hard edge — it just loops.
        paint.shader = LinearGradient(
            0f, 0f, w * 3f, h.toFloat(),
            colors, null, Shader.TileMode.CLAMP
        )
        startAnimating(w)
    }

    // v2.9.58 FIX: Reuse Matrix to avoid per-frame GC churn
    private val shaderMatrix = Matrix()

    private fun startAnimating(width: Int) {
        animator?.cancel()
        // v2.9.58 FIX: Honor animator duration scale = 0 (battery saver)
        val durationScale = android.provider.Settings.Global.getFloat(
            context.contentResolver,
            android.provider.Settings.Global.ANIMATOR_DURATION_SCALE,
            1f
        )
        if (durationScale == 0f) {
            return  // Battery saver mode — don't animate
        }
        animator = ValueAnimator.ofFloat(0f, width.toFloat()).apply {
            duration = durationMs
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            addUpdateListener {
                offset = it.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        paint.shader?.let { shader ->
            // v2.9.58 FIX: Reuse Matrix instead of allocating new one every frame
            shaderMatrix.setTranslate(-offset, 0f)
            shader.setLocalMatrix(shaderMatrix)
            canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        }
    }

    /** Call from onPause() so this isn't animating while off-screen. */
    fun pause() = animator?.pause()

    /** Call from onResume() to continue animating. */
    fun resume() = animator?.resume()

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        animator?.cancel()
    }
}
