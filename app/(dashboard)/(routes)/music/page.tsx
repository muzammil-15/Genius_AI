"use client";

import * as z from "zod";
import axios from "axios";
import { Heading } from "@/components/heading"

import { Loader, Music } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/ui/empty";



const ConversationPage = () => {

    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: ""
        }
      });

      const isLoading = form.formState.isSubmitting;
  
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            setMusic(undefined)
            
            const response = await axios.post('/api/music', values);
            
            setMusic(response.data.audio)
            form.reset();
          } catch (error: any) {
            if (error?.response?.status === 403) {
            //   proModal.onOpen();
            } else {
            //   toast.error("Something went wrong.");
            }
          } finally {
            router.refresh();
          }
      }



  return (
    <div>
        <Heading
        title="Music Generation"
        description="Turn your valueable text into Charming Music "
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
        <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="piano solo..." 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!music && !isLoading && (
            <Empty label="No music generated." />
          )}
          {
            music && (
              <audio className="w-full mt-8" controls>
                <source src={music}/>
              </audio>
            )
          }
      </div>
    </div>
    </div>
  )
}

export default ConversationPage