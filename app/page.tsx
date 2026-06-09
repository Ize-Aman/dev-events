import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Page = async () => {
  'use cache';
  cacheLife('hours');

  const response = await fetch(`${BASE_URL}/api/events`)
  const { events } = await response.json();

  return (
    <section id="home">
      <div className="-mt-10 flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center text-center">
        <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
        <p className="subheading">Hackathons, Meetups, and Conferences, All in One Place</p>

        <ExploreBtn />
      </div>

      <div id="events" className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
};

export default Page;
