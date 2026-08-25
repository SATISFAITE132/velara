export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-blush text-amber-deep',
    processing: 'bg-gold/20 text-gold-dark',
    shipped: 'bg-obsidian/10 text-obsidian',
    delivered: 'bg-success/15 text-success',
    cancelled: 'bg-error/15 text-error',
    active: 'bg-success/15 text-success',
    inactive: 'bg-obsidian/10 text-obsidian/50',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs capitalize ${map[status] || 'bg-obsidian/10'}`}>{status}</span>;
}
