"use client";

import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { BusinessInfo } from '@/lib/types';


const WhatsAppIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-white"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.4239 5.57652C16.4385 3.59103 13.8194 2.5 11.096 2.5C5.52425 2.5 1.05273 6.97152 1.05273 12.5433C1.05273 14.5457 1.6446 16.4221 2.68652 18.019L1 23L5.98103 21.3135C7.49138 22.2575 9.24867 22.7871 11.096 22.7871H11.1002C16.672 22.7871 21.1435 18.3156 21.1435 12.7438C21.1435 9.99971 20.0125 7.42442 18.0401 5.45203L18.4239 5.57652ZM11.1002 20.9701H11.0971C9.48834 20.9701 7.95465 20.5085 6.64333 19.658L6.25091 19.41L2.83152 20.353L3.79152 17.0185L3.52834 16.6053C2.56834 15.153 2.05273 13.4357 2.05273 11.6263C2.05273 7.55986 6.11263 4.31698 10.179 4.31698C12.1814 4.31698 14.0578 5.12323 15.4852 6.55065C16.9126 7.97808 17.7189 9.85442 17.7189 11.8569C17.7189 15.9234 14.476 20.0533 10.4096 20.0533C10.6385 20.9701 11.1002 20.9701 11.1002 20.9701ZM15.2971 14.6201C15.034 14.7733 14.074 15.2533 13.8271 15.3619C13.5802 15.4705 13.3985 15.5133 13.2008 15.344C13.0031 15.1747 12.352 14.9305 11.5358 14.1847C10.5185 13.2547 9.88349 12.1313 9.72634 11.8397C9.56919 11.548 9.71019 11.4113 9.84079 11.2807C9.95525 11.1662 10.102 10.9927 10.252 10.8355C10.3958 10.6862 10.454 10.5698 10.5483 10.3802C10.6426 10.1905 10.5844 10.0212 10.5139 9.88448C10.4435 9.74773 9.94757 8.52448 9.7499 8.04863C9.55634 7.57698 9.36279 7.64323 9.24419 7.63539C9.12558 7.62754 8.94392 7.62754 8.76226 7.62754C8.58059 7.62754 8.30315 7.69379 8.05634 7.94059C7.80953 8.1874 7.15849 8.7674 7.15849 9.99071C7.15849 11.214 8.07258 12.3885 8.21944 12.5782C8.36626 12.7678 9.42138 14.3977 11.0221 15.0862C12.9235 15.9113 13.348 15.9275 13.844 15.8694C14.4149 15.8032 15.352 15.2774 15.5671 14.9857C15.7823 14.694 15.7823 14.4472 15.72 14.3385C15.6578 14.23 15.4761 14.1872 15.2971 14.034L15.2971 14.6201Z"
        fill="currentColor"
      />
    </svg>
  );

export default function WhatsAppButton() {
  const firestore = useFirestore();
  const businessInfoDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'businessInfo') : null, [firestore]);
  const { data: businessInfo } = useDoc<BusinessInfo>(businessInfoDoc);
  
  const phoneNumber = businessInfo?.footerWhatsapp || '';
  if (!phoneNumber) return null;

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon />
    </Link>
  );
}
