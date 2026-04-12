"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Building, Users, Shield, Bell, Palette } from "lucide-react";
import Link from "next/link";

const settingsItems = [
  { title: "Enterprise Management", description: "Manage your enterprises, add new companies", icon: Building, href: "/settings/enterprises" },
  { title: "User Management", description: "Invite members, manage roles and permissions", icon: Users, href: "#" },
  { title: "Security", description: "Password, two-factor authentication, sessions", icon: Shield, href: "#" },
  { title: "Notifications", description: "Email and in-app notification preferences", icon: Bell, href: "#" },
  { title: "Appearance", description: "Theme, layout, and display preferences", icon: Palette, href: "#" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
