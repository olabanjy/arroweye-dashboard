import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { getSpinsNotificationPublic } from "@/services/api";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const SpinsNotification = () => {
  const { query } = useRouter();
  const { id } = query;
  const [notification, setNotification] = useState({
    content:
      "Great news! Run This Town was just played by DJ Shemztex at Front Back Restaurant, Accra, Ghana",
    timeAgo: "1 min ago",
  });

  useEffect(() => {
    if (!id) return;

    getSpinsNotificationPublic(id)
      .then((fetchedContent: any) => {
        const music = fetchedContent?.result?.metadata?.music?.[0];
        const session = fetchedContent?.session;
        const dj = session?.dj;

        if (!music || !dj) {
          console.warn("Missing music or DJ data in response");
          toast.warn("Missing music or DJ data in response");
          return;
        }

        const trackTitle = music.title;
        const djName = `${dj.first_name} ${dj.last_name}`;
        const location = session.location;
        const timestamp = fetchedContent?.result?.metadata?.timestamp_utc;

        setNotification({
          content: `Great news! ${trackTitle} was just played by ${djName}${location ? ` at ${location}` : ""}`,
          timeAgo: timestamp
            ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
            : "",
        });
      })
      .catch((err) => {
        console.error("Error fetching spins notification:", err);
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>Campaigns - Arroweye</title>
      </Head>

      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: "url(/spinsbg.png)" }}
      >
        <div
          className="flex items-center justify-center w-[338px] h-[174px]"
          style={{ backgroundImage: "url(/Notificationheader.png)" }}
        >
          <Image
            src="/spinslogomodal.svg"
            alt="spinslogo"
            width={86}
            height={86}
          />
        </div>
        <div className="bg-[#252525] min-w-[338px] max-w-[338px] p-5">
          <div className="flex justify-between">
            <Image
              src="/albumicon.svg"
              alt="albumicon"
              width={24}
              height={24}
            />
            <p className="text-[#B0B0B0] text-xs">{notification.timeAgo}</p>
          </div>
          <div>
            <p className="text-white mt-3 pl-1">{notification.content}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpinsNotification;
