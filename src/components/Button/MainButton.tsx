import { ButtonProps, Button } from "@nextui-org/react";
import { ReactNode } from "react";

interface MyButtonProps extends ButtonProps {
  content: string;
}

const MainButton: React.FC<MyButtonProps> = (Props) => {
  return (
    <div className="mx-5 h-36 w-36">
      <Button
        variant="faded"
        size="lg"
        {...Props}
        className="h-full text-xl whitespace-normal"
      >
        {Props.content}
      </Button>
    </div>
  );
};

export default MainButton;
