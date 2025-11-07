"use client";

import React from "react";
import { StructureItem } from "@/lib/structureService";

interface OrganizationalChartProps {
  structures: StructureItem[];
}

const OrganizationalChart: React.FC<OrganizationalChartProps> = ({ structures }) => {
  // Sort structures by order
  const sortedStructures = [...structures].sort((a, b) => a.order - b.order);

  // Group structures by hierarchy level based on order
  // Assuming: 1-2 = Top level, 3-6 = Second level, 7+ = Third level
  const topLevel = sortedStructures.filter(s => s.order <= 2);
  const secondLevel = sortedStructures.filter(s => s.order >= 3 && s.order <= 6);
  const thirdLevel = sortedStructures.filter(s => s.order >= 7);

  const PersonCard = ({ person, highlight = false }: { person: StructureItem; highlight?: boolean }) => (
    <div className={`flex flex-col items-center ${highlight ? 'transform scale-105' : ''}`}>
      <div className={`relative ${highlight ? 'mb-3' : 'mb-2'}`}>
        <div className={`${highlight ? 'w-32 h-32' : 'w-24 h-24'} rounded-lg overflow-hidden border-4 ${highlight ? 'border-green-500' : 'border-yellow-400'} shadow-lg bg-white`}>
          <img
            src={person.imageUrl}
            alt={person.personName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/default-avatar.png";
            }}
          />
        </div>
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${highlight ? 'bg-green-500' : 'bg-green-600'} text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
          {person.position}
        </div>
      </div>
      <div className="text-center">
        <p className={`font-bold text-gray-900 ${highlight ? 'text-base' : 'text-sm'}`}>{person.personName}</p>
      </div>
    </div>
  );

  const ConnectionLine = ({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) => (
    <div className={`${vertical ? 'w-1 h-8' : 'h-1 flex-1'} bg-gray-800 ${className}`} />
  );

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 rounded-xl">
      <div className="flex flex-col items-center space-y-6">
        {/* Top Level - Ketua & Wakil */}
        {topLevel.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex items-start justify-center gap-8 md:gap-16">
              {topLevel.map((person, index) => (
                <React.Fragment key={person.id}>
                  <PersonCard person={person} highlight={true} />
                  {index < topLevel.length - 1 && (
                    <div className="flex items-center pt-16">
                      <ConnectionLine />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {secondLevel.length > 0 && (
              <div className="flex flex-col items-center">
                <ConnectionLine vertical />
                <div className="w-full flex justify-center">
                  <div className="h-1 bg-gray-800" style={{ width: `${Math.min(secondLevel.length * 120, 800)}px` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Second Level - Sekretaris & Bendahara */}
        {secondLevel.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center max-w-5xl">
              {secondLevel.map((person) => (
                <div key={person.id} className="flex flex-col items-center">
                  <ConnectionLine vertical className="h-6" />
                  <PersonCard person={person} />
                </div>
              ))}
            </div>
            {thirdLevel.length > 0 && (
              <div className="flex flex-col items-center mt-4">
                <ConnectionLine vertical className="h-6" />
                <div className="w-full flex justify-center">
                  <div className="h-1 bg-gray-800" style={{ width: `${Math.min(thirdLevel.length * 100, 1000)}px` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Third Level - Divisi & RT/RW */}
        {thirdLevel.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6 justify-items-center max-w-7xl">
            {thirdLevel.map((person) => (
              <div key={person.id} className="flex flex-col items-center">
                <ConnectionLine vertical className="h-6" />
                <PersonCard person={person} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalChart;
