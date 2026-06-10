export default function Loading() {
    return (
        <section id="event" className="animate-pulse">
            <div className="header">
                <div className="h-10 w-72 rounded bg-white/10" />
                <div className="mt-4 h-5 w-full rounded bg-white/10" />
                <div className="mt-2 h-5 w-5/6 rounded bg-white/10" />
            </div>

            <div className="details">
                <div className="content space-y-6">
                    <div className="h-80 w-full rounded-2xl bg-white/10" />
                    <div className="space-y-3">
                        <div className="h-7 w-40 rounded bg-white/10" />
                        <div className="h-5 w-full rounded bg-white/10" />
                        <div className="h-5 w-11/12 rounded bg-white/10" />
                    </div>
                </div>

                <aside className="booking">
                    <div className="signup-card space-y-4">
                        <div className="h-7 w-40 rounded bg-white/10" />
                        <div className="h-5 w-full rounded bg-white/10" />
                        <div className="h-12 w-full rounded bg-white/10" />
                    </div>
                </aside>
            </div>
        </section>
    );
}