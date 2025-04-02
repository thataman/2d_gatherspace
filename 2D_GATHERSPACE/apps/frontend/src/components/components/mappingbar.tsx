
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "../ui/separator"
import { ScrollAreaSpace } from "./ScrollAreaSpace"
import { useState } from "react"
import { NewSpace } from "./newspace"


export function Mappingbar() {

const [activeTab,setactiveTab] = useState('tab1')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Space</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[968px] h-[650px]">
        <div className="h-fit inline-block pb-0">Select a Template</div>
         <div className=" flex w-full pl-2 pr-2 overflow-hidden">
             <div className="flex justify-start w-full "> <Button variant="ghost" className={`shadow-none bg-transparent  hover:bg-transparent focus:ring-0 focus:outline-none ${
                    activeTab === "tab1" ? "text-blue-500 border-b-2 " : "text-gray-600"} `} onClick={()=>setactiveTab('tab1')}>Offline Maps</Button>
         <Separator orientation="vertical" className="h-[28px] mt-1 w-[1px]" />
               <Button className={`shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none ${
                    activeTab === "tab1" ? "text-blue-500 border-b-2 " : "text-gray-600"} `} onClick={()=>setactiveTab('tab2')}>Purchased Maps</Button>
                </div>
                    <div className=" flex justify-end w-full ">  <Button>Assets</Button>
                   <NewSpace></NewSpace> </div>
            </div>
            <div className="w-full overflow-hidden  pl-2 pr-2">
                  {activeTab=='tab1'&&<ScrollAreaSpace/>}
                  {activeTab=='tab2'&&<ScrollAreaSpace/>}
                  
               </div>
      </DialogContent>
    </Dialog>
  )
}
