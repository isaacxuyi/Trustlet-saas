'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Building2, Loader2 } from 'lucide-react';

type BusinessSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: {
    id?: string;
    name: string;
    website: string | null;
    logo_url: string | null;
  } | null;
  onSuccess: () => void;
};

export function BusinessSetupDialog({
  open,
  onOpenChange,
  business,
  onSuccess,
}: BusinessSetupDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: business?.name || '',
    website: business?.website || '',
    logo_url: business?.logo_url || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    website: '',
  });

  function validateForm() {
    const newErrors = {
      name: '',
      website: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.website;
  }

  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        throw new Error('No access token');
      }

      const response = await fetch('/api/business-info', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          website: formData.website.trim() || null,
          logo_url: formData.logo_url.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save business');
      }

      toast({
        title: 'Success!',
        description: business
          ? 'Business information updated successfully'
          : 'Business created successfully',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Business save error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>
                {business ? 'Edit Business' : 'Set Up Your Business'}
              </DialogTitle>
              <DialogDescription>
                {business
                  ? 'Update your business information'
                  : 'Add your business details to start collecting reviews'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Acme Coffee Shop"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                disabled={loading}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://www.yourwebsite.com"
                value={formData.website}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value });
                  if (errors.website) setErrors({ ...errors, website: '' });
                }}
                disabled={loading}
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL (optional)</Label>
              <Input
                id="logo_url"
                type="url"
                placeholder="https://www.yourwebsite.com/logo.png"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-xs text-slate-500">
                Add a link to your business logo to customize your review form
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : business ? (
                'Update Business'
              ) : (
                'Create Business'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
