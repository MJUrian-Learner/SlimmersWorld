import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface LoaderProps {
  header?: React.ReactNode;
  description?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({
  header = "Loading...",
  description = "Please wait.",
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-foreground/30">
    <div className="flex flex-col w-full max-w-sm gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Animated loading spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Loading text with animation */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {header}
              </h3>
              <p className="text-sm text-muted-foreground animate-pulse">
                {description}
              </p>
            </div>
            {/* Progress dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
