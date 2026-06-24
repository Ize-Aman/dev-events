'use client';

import { deleteEvent } from "@/lib/actions/event.actions";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Page = ({ eventSlug }: { eventSlug: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    toast.promise(
      deleteEvent(eventSlug),
      {
        loading: 'Deleting Event...',
        success: 'Event Deleted!',
        error: "Can't delete event. An error occured!"
      }
    );
    
    const { success, error } = await deleteEvent(eventSlug);
 
    if (success) setTimeout(() => window.location.reload(), 2000);
    // else console.err('Can not delete event', error)
  }

  return (
    <div>
      <form onSubmit={handleDelete}>
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
