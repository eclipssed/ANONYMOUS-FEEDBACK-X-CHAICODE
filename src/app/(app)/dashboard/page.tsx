"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/models/user.model";
import { isaAcceptingMessagesSchema } from "@/schemas/isAcceptingMessagesSchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(
      messages.filter((message) => {
        return message._id !== messageId;
      })
    );
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(isaAcceptingMessagesSchema),
  });

  const { register, watch, setValue } = form;

  const isAcceptingMessages = watch("isAcceptingMessages");

  const fetchIsAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<apiResponse>("/api/accept-messages");
      // console.log(response)
      setValue("isAcceptingMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to set message settings.",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      // setIsSwitchLoading(true)
      try {
        const response = await axios.get<apiResponse>("/api/get-messages");
      
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "showing latest messages.",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchIsAcceptingMessages();
  }, [session, fetchMessages, fetchIsAcceptingMessages, setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/accept-messages", {
        isAcceptingMessages: !isAcceptingMessages,
      });

      if (response.data.success) {
        setValue("isAcceptingMessages", !isAcceptingMessages);
        toast({
          title: "Success",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Failed",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to set message settings.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "profile URL has been copied to clipboard",
    });
  };
  const user: User = session?.user as User;
  const username = user?.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  if (!session || !session.user) {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Welcome!</div>
          <p className="text-gray-700 text-base mb-4">
            Please log in to access exclusive content and features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={isAcceptingMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {isAcceptingMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
