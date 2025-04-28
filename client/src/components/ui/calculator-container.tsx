import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface CalculatorContainerProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  formContent: ReactNode;
  resultContent: ReactNode | null;
  showResults: boolean;
  infoContent?: ReactNode;
}

export function CalculatorContainer({
  title,
  description,
  icon: Icon,
  formContent,
  resultContent,
  showResults,
  infoContent
}: CalculatorContainerProps) {
  const [activeTab, setActiveTab] = useState<string>("calculator");

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="border-blue-100 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-full bg-blue-500 text-white flex-shrink-0">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-blue-800">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-blue-600 mt-1 text-sm sm:text-base">{description}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-blue-50 p-1 rounded-none">
              <TabsTrigger
                value="calculator"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
              >
                Calculadora
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
              >
                Información
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="p-0">
              <CardContent className="p-4 sm:p-6">
                {formContent}
              </CardContent>

              <AnimatePresence>
                {showResults && resultContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-blue-100 pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="mr-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center text-white"
                        >
                          ✓
                        </motion.div>
                        Resultados
                      </h3>
                      {resultContent}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="info" className="p-4 sm:p-6">
              {infoContent ? (
                infoContent
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Información no disponible para esta calculadora.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}