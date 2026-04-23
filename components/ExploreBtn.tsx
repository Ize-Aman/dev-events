'use client';

const ExploreBtn = () => {
    return (
        <div>
            <button type="button" id="explore-btn" className="mt-7 mx-auto">
                <a href="#events">Explore Events</a>
                <img src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
            </button>
        </div>
    )
};

export default ExploreBtn;
