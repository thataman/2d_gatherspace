
import { useForm, SubmitHandler } from "react-hook-form"



import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface Inputs {
  email: string,
  password: string,
}



export function CardWithForm( ) {

  const {
    register,
    handleSubmit,
    watch,
    formState: {  isSubmitting },
  } = useForm<Inputs>()


  const signupsubmit = async(data: Inputs) => {
    await new Promise((resolve)=>{
setTimeout(resolve,5000);
    }
    )
    console.log(data);

  }
  return (
    <Card className="w-[350px]">
      <form onSubmit={handleSubmit(signupsubmit)}>
        <CardHeader>
          <CardTitle>log in</CardTitle>
          {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
        </CardHeader>
        <CardContent>

          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input   {...register("email", { required: true })} placeholder="enter you email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password"  {...register("password", { required: true })} placeholder="enter your password" />
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isSubmitting} >{isSubmitting?"subitting" :"login"}</Button>
        </CardFooter>
      </form>
    </Card>

  )
}