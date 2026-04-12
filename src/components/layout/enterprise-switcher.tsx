"use client";

import { useEnterprise } from "@/components/providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Check } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function EnterpriseSwitcher() {
  const { enterprises, currentEnterprise, setCurrentEnterprise } = useEnterprise();

  if (!currentEnterprise) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[200px] justify-start">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
            {getInitials(currentEnterprise.name)}
          </div>
          <span className="truncate text-sm">{currentEnterprise.name}</span>
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Switch Enterprise
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {enterprises.map((enterprise) => (
          <DropdownMenuItem
            key={enterprise.id}
            onClick={() => setCurrentEnterprise(enterprise)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
                {getInitials(enterprise.name)}
              </div>
              <div>
                <p className="text-sm font-medium">{enterprise.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{enterprise.role}</p>
              </div>
            </div>
            {enterprise.id === currentEnterprise.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
