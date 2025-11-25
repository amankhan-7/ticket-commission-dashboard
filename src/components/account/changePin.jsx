"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePinMutation } from "@/utils/redux/api/loginAuth";

export function ChangePinCard() {
  const [open, setOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [changePin, { isLoading }] = useChangePinMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPin || !newPin) return;

    try {
      await changePin({ currentPin, newPin }).unwrap();
      setOpen(false);
      setCurrentPin("");
      setNewPin("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      className="rounded-xl shadow-lg border-t-4 overflow-hidden mb-0"
      style={{ borderTopColor: "#004AAD" }}
    >
      <CardContent className="p-0">

        {/* --- Collapsed Menu Item --- */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center px-5 py-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#004AAD]/10 text-[#004AAD] mr-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="flex-1 text-left">
              <div className="font-semibold text-black">Change PIN</div>
              <div className="text-sm text-gray-500">Update your security PIN</div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* --- Expanded Form --- */}
        {open && (
          <div className="p-5 space-y-5">
            <h3 className="text-lg font-semibold">Change PIN</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Old PIN */}
              <div className="flex flex-col space-y-1">
                <Label>Old PIN</Label>
                <Input
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter old PIN"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#004AAD]"
                />
              </div>

              {/* New PIN */}
              <div className="flex flex-col space-y-1">
                <Label>New PIN</Label>
                <Input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#004AAD]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#004AAD] text-white w-full sm:w-auto"
                >
                  {isLoading ? "Saving..." : "Submit"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
