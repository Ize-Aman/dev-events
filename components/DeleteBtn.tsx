'use client';

import { deleteEvent } from "@/lib/actions/event.actions";
import { useState } from "react";

import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

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
            <button type="submit" className="btn-delete"><FaCheck /></button> 
            <button type="button" className="btn-delete" onClick={(e) => {e.stopPropagation(); setIsClicked(false);}}><RxCross2 /></button>
          </div>
          </div>
          : <>Delete</>}
        </div>
      </form>
    </div>
  )
};

export default Page;
