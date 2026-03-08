import { Link } from "react-router-dom";
import { BenefitType, formatNumber } from "@/data/welfareData";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface BenefitTypeCardProps {
  benefit: BenefitType;
  className?: string;
}

export function BenefitTypeCard({ benefit, className }: BenefitTypeCardProps) {
  return (
    <Link
      to={`/benefit/${benefit.id}`}
      className={cn(
        "group dashboard-card p-5 flex flex-col gap-4 transition-all hover:border-primary/30 hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{benefit.icon}</span>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {benefit.name}
            </h3>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </div>
        </div>
        <ArrowLeft className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(benefit.nationalRecipients)}
          </p>
          <p className="text-xs text-muted-foreground">מקבלים</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">
            {benefit.nationalRatePer1000.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">ל-1000 {benefit.targetPopulation}</p>
        </div>
      </div>
    </Link>
  );
}
