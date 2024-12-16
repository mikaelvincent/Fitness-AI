import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileCardWrapperProps {
  title: string;
  backButtonHref: string;
  children: ReactNode;
}

const ProfileCardWrapper = ({
  title,
  backButtonHref,
  children,
}: ProfileCardWrapperProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className={`w-10/12 border-0 shadow-none md:w-1/2 lg:w-2/3`}>
        <Button
          variant="link"
          size="lg"
          className="text-primary"
          onClick={() => navigate(backButtonHref)}
        >
          <ChevronLeft />
          <span>Back</span>
        </Button>
        <CardHeader className="flex items-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};

export default ProfileCardWrapper;
