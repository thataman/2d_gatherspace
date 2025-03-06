
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollAreaSpace } from "./ScrollAreaSpace"
import { useState } from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Ghost } from "lucide-react"


export function Mapdetails() {
  const [activeTab,setactiveTab] = useState('tab1')
  return (
    <>
    <div>
    <div className="flex ">
      <Button variant="ghost" className={`shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none ${
            activeTab === "tab1" ? "text-blue-500 border-b-2 " : "text-gray-600"} `} onClick={()=>setactiveTab('tab1')}>recent</Button>
      <Separator orientation="vertical"></Separator>
      <Button className={`shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:outline-none ${
            activeTab === "tab1" ? "text-blue-500 border-b-2 " : "text-gray-600"} `} onClick={()=>setactiveTab('tab2')}>myspaes</Button>
    </div>
    <div className="w-[80%]">
          {activeTab=='tab1'&&<ScrollAreaSpace/>}
          {activeTab=='tab2'&&<ScrollAreaSpace/>}
          
       </div>
       </div>
       </>
  )
}
