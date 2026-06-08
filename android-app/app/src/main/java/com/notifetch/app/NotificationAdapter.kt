package com.notifetch.app

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView
import com.google.android.material.chip.Chip

/**
 * RecyclerView adapter for displaying captured notification items.
 */
class NotificationAdapter(
    private val onItemClick: (NotificationData) -> Unit,
    private val onItemLongClick: (NotificationData) -> Unit,
) : ListAdapter<NotificationData, NotificationAdapter.NotificationViewHolder>(NotificationDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_notification, parent, false)
        return NotificationViewHolder(view)
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        val notification = getItem(position)
        holder.bind(notification)
    }

    inner class NotificationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        private val card: MaterialCardView = itemView.findViewById(R.id.card_notification)
        private val tvSource: TextView = itemView.findViewById(R.id.tv_source)
        private val tvTitle: TextView = itemView.findViewById(R.id.tv_title)
        private val tvBody: TextView = itemView.findViewById(R.id.tv_body)
        private val tvTimestamp: TextView = itemView.findViewById(R.id.tv_timestamp)
        private val chipCategory: Chip = itemView.findViewById(R.id.chip_category)
        private val tvUnreadDot: View = itemView.findViewById(R.id.unread_dot)
        private val tvSourceEmoji: TextView = itemView.findViewById(R.id.tv_source_emoji)

        fun bind(notification: NotificationData) {
            val partnerInfo = DeliveryPartners.getPartner(notification.packageName)

            // Source emoji and name
            tvSourceEmoji.text = partnerInfo?.emoji ?: "📦"
            tvSource.text = notification.source

            // Title and body
            tvTitle.text = notification.title.ifBlank { "(No title)" }
            tvBody.text = notification.body.ifBlank { "" }
            tvBody.visibility = if (notification.body.isBlank()) View.GONE else View.VISIBLE

            // Timestamp (relative)
            tvTimestamp.text = formatRelativeTime(notification.timestamp)

            // Category chip
            val categoryDetail = CategoryInfo.getDetail(notification.category)
            if (categoryDetail != null) {
                chipCategory.text = categoryDetail.displayName
                chipCategory.visibility = View.VISIBLE
            } else {
                chipCategory.visibility = View.GONE
            }

            // Unread indicator
            tvUnreadDot.visibility = if (!notification.isRead) View.VISIBLE else View.GONE

            // Card stroke for unread
            if (!notification.isRead) {
                card.strokeColor = itemView.context.getColor(R.color.notifetch_amber)
                card.strokeWidth = 2
            } else {
                card.strokeColor = 0
                card.strokeWidth = 0
            }

            // Click listeners
            card.setOnClickListener { onItemClick(notification) }
            card.setOnLongClickListener {
                onItemLongClick(notification)
                true
            }
        }

        private fun formatRelativeTime(timestamp: Long): String {
            val now = System.currentTimeMillis()
            val diff = now - timestamp

            return when {
                diff < 60_000 -> "Just now"
                diff < 3_600_000 -> "${diff / 60_000}m ago"
                diff < 86_400_000 -> "${diff / 3_600_000}h ago"
                diff < 604_800_000 -> "${diff / 86_400_000}d ago"
                else -> {
                    val sdf = java.text.SimpleDateFormat("MMM dd, yyyy", java.util.Locale.getDefault())
                    sdf.format(java.util.Date(timestamp))
                }
            }
        }
    }

    /**
     * DiffUtil callback for efficient list updates.
     */
    class NotificationDiffCallback : DiffUtil.ItemCallback<NotificationData>() {
        override fun areItemsTheSame(oldItem: NotificationData, newItem: NotificationData): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: NotificationData, newItem: NotificationData): Boolean {
            return oldItem == newItem
        }
    }
}
