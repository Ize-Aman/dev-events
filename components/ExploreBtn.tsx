'use client';

const ExploreBtn = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    return (
        <div>
            <button type="button" id="explore-btn" onClick={() => scrollToSection('events')} className="mt-7 mx-auto">
                Explore Events
                <img src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
            </button>
        </div>
    )
};

export default ExploreBtn;
