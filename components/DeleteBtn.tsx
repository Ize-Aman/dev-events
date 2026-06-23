'use client';

import { deleteEvent } from "@/lib/actions/event.actions";
import { Check, X } from "lucide-react";
import { useState } from "react";

const Page = ({ eventSlug }: { eventSlug: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async () => {
    const { success, error } = await deleteEvent(eventSlug);

    if (success) console.log('event deleted')
    else console.log('Can not delete event', error)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div onClick={() => setIsClicked(true)} className="btn-delete">
          {
          isClicked
          ? <div className="flex flex-col">
          Are you sure?
          <div className="flex flex-row gap-6">
            <button type="submit" className="btn-delete"><Check size={18} /></button> 
            <button type="button" className="btn-delete" onClick={(e) => {e.stopPropagation(); setIsClicked(false);}}><X size={18} /></button>
          </div>
          </div>
          : <>Delete</>}
        </div>
      </form>
    </div>
  )
};

export default Page;
