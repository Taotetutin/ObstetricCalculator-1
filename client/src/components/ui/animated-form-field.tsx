import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface AnimatedFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  control: ReactNode;
  index?: number;
}

export function AnimatedFormField({
  form,
  name,
  label,
  description,
  icon: Icon,
  control,
  index = 0
}: AnimatedFormFieldProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="bg-white p-4 rounded-lg shadow-sm border border-blue-50 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="h-4.5 w-4.5 text-blue-500" />}
              <FormLabel className="text-blue-700 font-medium">{label}</FormLabel>
            </div>
            {description && (
              <FormDescription className="text-sm text-gray-500 mb-2">
                {description}
              </FormDescription>
            )}
            <FormControl>{React.cloneElement(control as React.ReactElement, { ...field })}</FormControl>
            <FormMessage className="text-red-500 text-sm mt-1" />
          </FormItem>
        )}
      />
    </motion.div>
  );
}

export function AnimatedCheckboxField({
  form,
  name,
  label,
  description,
  index = 0
}: Omit<AnimatedFormFieldProps, 'control' | 'icon'> & { index?: number }) {
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 p-3 rounded-lg hover:bg-blue-50 transition-all">
            <FormControl>
              <div className="pt-0.5">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: field.value ? 1.1 : 1,
                      boxShadow: field.value ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="rounded-sm"
                  >
                    <input
                      type="checkbox"
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-blue-200 
                        bg-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                        disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </motion.div>
                  {field.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold pointer-events-none"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </div>
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className={`text-sm font-medium ${field.value ? 'text-blue-700' : 'text-gray-700'}`}>
                {label}
              </FormLabel>
              {description && (
                <FormDescription className="text-xs text-gray-500">
                  {description}
                </FormDescription>
              )}
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}