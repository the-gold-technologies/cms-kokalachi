"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface PropertyRow {
  property: string;
  value: string;
}

interface PropertiesTableEditorProps {
  label?: string;
  rows?: PropertyRow[];
  properties?: PropertyRow[];
  onChange: (rows: PropertyRow[]) => void;
}

export function PropertiesTableEditor({
  label = "Physico-Chemical Properties Table",
  rows: propRows,
  properties: propProperties,
  onChange,
}: PropertiesTableEditorProps) {
  const activeRows = propRows ?? propProperties ?? [];

  const handleAddRow = () => {
    onChange([...activeRows, { property: "", value: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    onChange(activeRows.filter((_, idx) => idx !== index));
  };

  const handleUpdateCell = (index: number, field: "property" | "value", val: string) => {
    const updated = [...activeRows];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs font-bold text-[#D8232A] hover:text-[#b51b21] flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Spec Row
        </button>
      </div>

      {activeRows.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-2xl text-center text-xs text-gray-400">
          No laboratory test specifications added yet.
        </div>
      ) : (
        <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-2.5 px-4">Test Property Name</th>
                <th className="py-2.5 px-4">Typical Value / Unit</th>
                <th className="py-2.5 px-3 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40">
                  <td className="p-2.5 px-3">
                    <input
                      type="text"
                      value={row.property}
                      onChange={(e) => handleUpdateCell(idx, "property", e.target.value)}
                      placeholder="e.g. Kinematic Viscosity @ 100°C, cSt"
                      className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D8232A]"
                    />
                  </td>
                  <td className="p-2.5 px-3">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleUpdateCell(idx, "value", e.target.value)}
                      placeholder="e.g. 14.5 - 15.5"
                      className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D8232A]"
                    />
                  </td>
                  <td className="p-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
