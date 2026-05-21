
"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { useLanguage } from '@/hooks/use-language';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, Bell, Shield, Languages, Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
  const { profile } = useAuth();
  const db = useFirestore();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [bio, setBio] = useState(profile?.bio || '');
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [isSaving, setIsSubmitting] = useState(false);

  const handleSaveProfile = async () => {
    if (!profile || !db) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        bio,
        displayName
      });
      toast({ title: "Profile updated successfully" });
    } catch (e) {
      toast({ variant: "destructive", title: "Failed to update profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Account Settings
          </h1>
          <p className="text-muted-foreground">Manage your student profile and application preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start gap-3 bg-primary/5 text-primary">
                <User className="h-4 w-4" /> Profile Details
              </Button>
              <Button variant="ghost" className="justify-start gap-3 opacity-50 cursor-not-allowed">
                <Bell className="h-4 w-4" /> Notifications
              </Button>
              <Button variant="ghost" className="justify-start gap-3 opacity-50 cursor-not-allowed">
                <Shield className="h-4 w-4" /> Security
              </Button>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-8">
            {/* Profile Section */}
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Student Identity
                </CardTitle>
                <CardDescription>How other students see you on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your campus name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me (Bio)</Label>
                  <Textarea 
                    id="bio" 
                    className="min-h-[120px] resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your peers a bit about yourself..."
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/20 border-t p-4 flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile Changes
                </Button>
              </CardFooter>
            </Card>

            {/* Application Section */}
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" /> Application Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language / 언어</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                  </div>
                  <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="ko">한국어 (KO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce eye strain during night study.</p>
                  </div>
                  <Switch disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
