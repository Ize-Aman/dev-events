'use client';

import { deleteEvent } from "@/lib/actions/event.actions";
import { useState } from "react";

const Page = ({eventSlug}: {eventSlug: string}) => {
    const [isClicked, setIsClicked] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {success, error} = await deleteEvent(eventSlug);

        if(success) console.log('event deleted')
        else console.log('Can not delete event',error)
    }

  return (
    <div>
      <form onSubmit={handleSubmit}><button type="submit" onClick={async () => {await setIsClicked(true);console.log(isClicked)}} className="btn-delete">Delete</button></form>
    </div>
  )
};

export default Page;
