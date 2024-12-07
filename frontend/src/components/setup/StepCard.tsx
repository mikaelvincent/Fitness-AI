import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface StepProps {
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const StepCard: React.FC<StepProps> = ({ title, children, footer }) => {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {children}
            </CardContent>
            {footer && <CardFooter className="flex justify-end space-x-2">{footer}</CardFooter>}
        </Card>
    );
};
