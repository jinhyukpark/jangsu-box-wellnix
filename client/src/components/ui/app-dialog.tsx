/**
 * AppDialog - 웹앱 컨테이너 내부에 표시되는 다이얼로그
 *
 * 기존 Dialog와 달리 브라우저 전체 화면이 아닌
 * 430px 웹앱 컨테이너 내부에서 다이얼로그가 표시됩니다.
 */
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContainer } from "@/components/AppLayout";

const AppDialog = DialogPrimitive.Root;
const AppDialogTrigger = DialogPrimitive.Trigger;
const AppDialogClose = DialogPrimitive.Close;

interface AppDialogPortalProps extends DialogPrimitive.DialogPortalProps {
  children: React.ReactNode;
}

const AppDialogPortal = ({ children, ...props }: AppDialogPortalProps) => {
  const context = useAppContainer();
  // AppLayout 외부에서 사용될 경우 기본 portal (document.body) 사용
  const container = context?.containerRef.current ?? undefined;

  return (
    <DialogPrimitive.Portal container={container} {...props}>
      {children}
    </DialogPrimitive.Portal>
  );
};

const AppDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "absolute inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
AppDialogOverlay.displayName = "AppDialogOverlay";

const AppDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AppDialogPortal>
    <AppDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "absolute left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </AppDialogPortal>
));
AppDialogContent.displayName = "AppDialogContent";

const AppDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
AppDialogHeader.displayName = "AppDialogHeader";

const AppDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
AppDialogFooter.displayName = "AppDialogFooter";

const AppDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AppDialogTitle.displayName = "AppDialogTitle";

const AppDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AppDialogDescription.displayName = "AppDialogDescription";

export {
  AppDialog,
  AppDialogPortal,
  AppDialogOverlay,
  AppDialogTrigger,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogFooter,
  AppDialogTitle,
  AppDialogDescription,
};
