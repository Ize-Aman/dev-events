const Page = () => {
  return (
    <section id="admin" className="animate-pulse">
        <div className="flex flex-col gap-4 sm:mb-6 sm:flex-row sm:justify-between">
            <div className="h-10 w-80 sm:h-22 sm:w-80 md:h-13 md:w-110 rounded bg-white/10"/>
            <div className="h-10 w-full sm:h-22 sm:w-40 md:h-13 rounded bg-white/10"/>
        </div>
        <div className="mt-6">
            <div className="h-110 w-full rounded bg-white/10" />
        </div>
    </section>
  )
};

export default Page;
