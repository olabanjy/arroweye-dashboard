import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog } from "primereact/dialog";
import { ClaimReward } from "@/services/api";

interface MomentCardProps {
  giftingPin?: string;
  giftings?: any[];
  videoUrls: string[];
  reportUrls: string[];
  videoTitle: string;
  watchButtonText?: string;
  downloadButtonText?: string;
  radioButtonText?: string;
  downloadIcon?: boolean;
  outline?: boolean;
  subText?: string;
  MomentsTitle?: string;
  assetsButton?: string;
  csvData?: any;
}

const MomentCard: React.FC<MomentCardProps> = ({
  giftingPin,
  giftings,
  videoUrls = [],
  reportUrls = [],
  videoTitle,
  watchButtonText,
  downloadButtonText = "Download Data",
  radioButtonText,
  downloadIcon = true,
  outline = false,
  subText,
  MomentsTitle,
  assetsButton,
  csvData,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [claimRewardDialog, setClaimRewardDialog] = useState(false);

  // Validate video URLs on component mount and when URLs change
  useEffect(() => {
    validateVideoUrls();
  }, [videoUrls]);

  const validateVideoUrls = () => {
    if (!videoUrls || videoUrls.length === 0) {
      setError("No Media Added Yet");
      return false;
    }

    setError(null);
    return true;
  };

  const handlePlayClick = () => {
    if (validateVideoUrls()) {
      setIsPlaying(true);
    }
  };

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validateVideoUrls()) {
      setCurrentVideoIndex((prev) =>
        prev === 0 ? videoUrls.length - 1 : prev - 1
      );
      setIsPlaying(false);
    }
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validateVideoUrls()) {
      setCurrentVideoIndex((prev) =>
        prev === videoUrls.length - 1 ? 0 : prev + 1
      );
      setIsPlaying(false);
    }
  };

  const downloadCSV = (data: any, filename = "Data.csv") => {
    const headers = Object.keys(data).join(",") + "\n";
    const values = Object.values(data).join(",") + "\n";

    const csvContent = headers + values;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    console.log("NA THE GIFTS BE THIS", giftings);
    console.log("NA THE PIN COME BE THIS", giftingPin);
  }, [giftings]);

  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [claimError, setClaimError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get the most recent unclaimed gifting
  const mostRecentClaimedGift =
    giftings && giftings.length > 0
      ? giftings
          .filter((gift) => gift.claimed)
          .sort((a, b) => {
            const dateA = new Date(a.created).getTime();
            const dateB = new Date(b.created).getTime();
            return dateB - dateA;
          })[0] || null
      : null;
  const mostRecentUnclaimedGift =
    giftings && giftings.length > 0
      ? giftings
          .filter((gift) => !gift.claimed) // Only consider unclaimed gifts
          .sort((a, b) => {
            const dateA = new Date(a.created).getTime();
            const dateB = new Date(b.created).getTime();
            return dateB - dateA;
          })[0] || null
      : null;

  useEffect(() => {
    // Reset states when dialog is closed
    if (!claimRewardDialog) {
      setShowPinInput(false);
      setPin("");
      setClaimError("");
      setSuccess(false);
    }
  }, [claimRewardDialog]);

  const handlePinChange = (e: any) => {
    setPin(e.target.value);
    if (e.target.value.length < 6) {
      setClaimError("");
    }
  };

  const handleRedeemClick = () => {
    setShowPinInput(true);
  };

  const verifyPin = () => {
    if (pin.length < 6) {
      setClaimError("Pin must be at least 6 characters long");
      return;
    }

    if (pin === giftingPin) {
      setClaimError("");
      if (mostRecentUnclaimedGift && mostRecentUnclaimedGift.report) {
        const payload = { reward_id: mostRecentUnclaimedGift?.id };
        ClaimReward(payload)
          .then(() => {
            setSuccess(true);

            downloadGift(mostRecentUnclaimedGift.report);
          })
          .catch((err) => {
            console.error("Error claiming reward:", err);
          });
      }
    } else {
      setClaimError("Invalid pin. Please try again.");
    }
  };

  const downloadGift = (fileUrl: any) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("download", "your_gift.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

      <div className="relative h-[300px] rounded overflow-hidden group">
        {error ? (
          <Alert
            variant="destructive"
            className="h-full flex items-center justify-center"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <iframe
              className="w-full h-full"
              src={`${videoUrls[currentVideoIndex]}?autoplay=${isPlaying ? "1" : "0"}&controls=1&showinfo=0&rel=0`}
              title={`${videoTitle} - Video ${currentVideoIndex + 1}`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>

            {/* Navigation Buttons */}
            {videoUrls.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevVideo}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextVideo}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {!isPlaying && (
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors"
                onClick={handlePlayClick}
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-black border-b-[12px] border-b-transparent ml-1" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      <div className="space-y-[5px] flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 w-full">
          {watchButtonText && (
            <button
              className="p-2 cursor-pointer hover:bg-orange-500 font-IBM text-[16px] font-[500] flex-grow rounded bg-black text-white text-center"
              onClick={() =>
                window.open(videoUrls[currentVideoIndex], "_blank")
              }
              disabled={!videoUrls[currentVideoIndex]}
            >
              {watchButtonText}
            </button>
          )}

          {downloadIcon && watchButtonText && (
            <button
              className="bg-black hover:bg-orange-500 font-IBM text-[16px] font-medium text-white p-[11px] rounded inline-flex"
              onClick={() =>
                window.open(videoUrls[currentVideoIndex], "_blank")
              }
              disabled={!videoUrls[currentVideoIndex]}
            >
              <MdOutlineFileDownload className="text-[16px]" />
            </button>
          )}
        </div>
        {assetsButton && (
          <p className="p-2 cursor-pointer text-[16px] font-[500] font-IBM w-full rounded text-center hover:bg-orange-500 bg-black text-white">
            {assetsButton}
          </p>
        )}
        <button
          className="p-2 font-IBM text-[16px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
          onClick={() => downloadCSV(csvData)}
          // disabled={!reportUrls[currentVideoIndex]}
        >
          <p>{downloadButtonText}</p>
          <sup className="font-bold p-2 rounded-full bg-white text-black mt-1">
            CSV
          </sup>
        </button>

        {radioButtonText && (
          <button
            className={`p-2 mt-[20px] cursor-pointer text-[16px] font-[500] font-IBM w-full rounded text-center ${
              outline
                ? "border border-black text-black hover:bg-black hover:text-white"
                : "hover:bg-orange-500 bg-black text-white"
            }`}
            onClick={() => setClaimRewardDialog(true)}
            disabled={!reportUrls[currentVideoIndex]}
          >
            {radioButtonText}
          </button>
        )}

        {subText && (
          <p className="text-[12px] font-[400] text-center">{subText}</p>
        )}
      </div>

      <div
        className={`custom-dialog-overlay ${
          claimRewardDialog
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          header={"CLAIM REWARD"}
          visible={claimRewardDialog}
          onHide={() => setClaimRewardDialog(false)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog"
        >
          <div className="bg-white p-4 rounded-lg space-y-4 font-IBM">
            {!showPinInput ? (
              <>
                {mostRecentUnclaimedGift ? (
                  <>
                    <p className="font-semibold text-lg">Congrats! 🎉</p>
                    <p className="mb-0">
                      <span id="thankYouMessage">
                        Thank you for making beautiful music with us during your
                        campaign. Our collaboration was pitch-perfect 👌🏽, and we
                        look forward to many more harmonious projects 🤝🏽.
                      </span>{" "}
                      <span id="message">
                        Throughout this campaign, we've gotten to know you well,
                        and we hope you've learned more about us too. Your
                        milestones are truly remarkable and as a sincere thank
                        you, we're thrilled to present you with a gift 🎁 to
                        share with your team. See you soon. 🧡
                      </span>{" "}
                    </p>
                    <button
                      className="p-2 font-IBM text-[16px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
                      onClick={handleRedeemClick}
                    >
                      Redeem Gift
                    </button>
                  </>
                ) : (
                  <>
                    <p>Congrats! 🎉</p>
                    <p className="mb-0">
                      <span id="thankYouMessage">
                        Thank you for orchestrating an incredible campaign with
                        us; your harmony with our team hit all the right notes
                        🎶. We look forward to more collaborations 🤝🏽 that will
                        keep our partnership in perfect pitch.
                      </span>{" "}
                      <span id="message">
                        Throughout this campaign, we’ve gotten to know you well,
                        and we hope you’ve learned more about us too. Your
                        milestones are truly remarkable and as a sincere thank
                        you, we’re thrilled to present you with a gift 🎁 to
                        share with your team. See you soon. 🧡
                      </span>{" "}
                    </p>
                    <p className="mt-5">
                      Redeemed by
                      <span className="font-bold">
                        {mostRecentClaimedGift &&
                          mostRecentClaimedGift.claimed_by &&
                          mostRecentClaimedGift.claimed_by}
                      </span>
                      Thank you for your participation in the campaign!
                    </p>
                    <button
                      className="p-2 font-IBM text-[16px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-gray-700 bg-gray-500 inline-flex items-center gap-2 justify-center"
                      onClick={() => setClaimRewardDialog(false)}
                    >
                      Close
                    </button>
                  </>
                )}
              </>
            ) : success ? (
              <>
                <p className="font-semibold text-lg">Success! 🎉</p>
                <p className="mb-4">
                  Your gift is being downloaded. Thank you for your amazing
                  work!
                </p>
                <button
                  className="p-2 font-IBM text-[16px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
                  onClick={() => setClaimRewardDialog(false)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-lg">Enter Your Pin</p>
                <p className="mb-4">
                  Please enter your project pin to redeem your gift.
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    name="project_password"
                    value={pin}
                    onChange={handlePinChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your pin"
                    autoComplete="off"
                  />
                  {claimError && (
                    <p className="text-red-500 text-sm">{claimError}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 font-IBM text-[16px] font-[500] flex-1 rounded text-white text-center cursor-pointer hover:bg-gray-700 bg-gray-500 inline-flex items-center gap-2 justify-center"
                    onClick={() => setShowPinInput(false)}
                  >
                    Back
                  </button>
                  <button
                    className="p-2 font-IBM text-[16px] font-[500] flex-1 rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
                    onClick={verifyPin}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default MomentCard;
