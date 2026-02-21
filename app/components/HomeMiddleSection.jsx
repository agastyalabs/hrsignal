'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Shield, Globe, CheckCircle2 } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

const Card = ({ title, metric, children, link }) => {
 const open, setOpen] = useState(false);
 return (
 <div className="rounded-xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-xl font-bold text-foreground">{title}</h3>
 <p className="text-3xl font-bold text-primary mt-2">{metric}</p>
 </div>
 <Collapsible open={open} onOpenChange={setOpen}>
 <CollapsibleTrigger className="mt-2 p-2">
 {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
 </CollapsibleTrigger>
 <CollapsibleContent className="mt-4 text-muted-foreground text-sm">
 {children}
 </CollapsibleContent>
 </Collapsible>
 </div>
 <a href={link} className="inline-block mt-6 text-primary font-medium hover:underline">
 Read more →
 </a>
 </div>
 );
};

export default function HomeMiddleSection() {
 return (
 <section className="py-20 px-6 max-w-7xl mx-auto">
 <div className="grid md:grid-cols-2 gap-10 mb-16">
 <Card title="Keka Fit" metric="98%" link="/vendors/keka">
 Leading payroll + HRMS for India. Full ESIC, PF, TDS, LWF, PT compliance baked in.
 </Card>
 <Card title="Compliance Check" metric="100%" link="/compliance">
 Real-time tracking of DTC, Bonus Act, Gratuity, Shops & Establishment across 28 states.
 </Card>
 </div>

 <div className="my-20 text-center">
 <Image
 src="/coverage-snapshot.png"
 width={800}
 height={500}
 alt="India payroll compliance coverage map"
 loading="lazy"
 className="rounded-2xl shadow-2xl mx-auto"
 />
 </div>

 <div className="flex justify-center gap-12 flex-wrap text-lg">
 <div className="flex items-center gap-3"><Shield className="w-9 h-9 text-green-500" /> SOC 2 Type II</div>
 <div className="flex items-center gap-3"><Globe className="w-9 h-9 text-blue-500" /> GDPR Ready</div>
 <div className="flex items-center gap-3"><CheckCircle2 className="w-9 h-9 text-purple-500" /> ISO 27001</div>
 </div>
 </section>
 );
}
