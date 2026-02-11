"use client"

import React, { useState } from "react"
import { BarChart3, PieChart } from "lucide-react"
import { type NavSection } from "@/components/shell"
import { FilterGroupContainer } from "@/components/shell"
import { MultiSelect } from "@/components/filters/MultiSelect"
import { surveyFilterOptions } from "@/lib/mock-data"

/* ------------------------------------------------------------------ */
/*  Shared Navigation Sections                                         */
/* ------------------------------------------------------------------ */
export const surveyNavSections: NavSection[] = [
  {
    title: "Statistical Survey",
    items: [
      {
        id: "registration",
        label: "Registration",
        icon: <BarChart3 className="h-[18px] w-[18px]" />,
        href: "/",
      },
      {
        id: "market-share",
        label: "Market Share",
        icon: <PieChart className="h-[18px] w-[18px]" />,
        href: "/market-share",
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toOptions(values: string[]) {
  return values.map((v) => ({ value: v, label: v }))
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2 py-1 font-body text-sm text-darkest-grey"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="accent-dark-green"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Survey Filters (24 columns in 5 groups)                            */
/* ------------------------------------------------------------------ */
export function SurveyFilters() {
  const [rvType, setRvType] = useState<string[]>([])
  const [motOrTow, setMotOrTow] = useState<string[]>([])
  const [rvSubtype, setRvSubtype] = useState<string[]>([])
  const [thorOpCo, setThorOpCo] = useState<string[]>([])
  const [modelYear, setModelYear] = useState<string[]>([])
  const [rvModel, setRvModel] = useState<string[]>([])
  const [priceGroup, setPriceGroup] = useState<string[]>([])
  const [chassis, setChassis] = useState<string[]>([])
  const [gvw, setGvw] = useState<string[]>([])
  const [driveType, setDriveType] = useState<string[]>([])
  const [axles, setAxles] = useState<string[]>([])
  const [isRental, setIsRental] = useState<string[]>([])
  const [isThor, setIsThor] = useState<string[]>([])
  const [placementState, setPlacementState] = useState<string[]>([])
  const [placementBta, setPlacementBta] = useState<string[]>([])
  const [placementCity, setPlacementCity] = useState<string[]>([])
  const [placementCounty, setPlacementCounty] = useState<string[]>([])
  const [placementZip, setPlacementZip] = useState<string[]>([])
  const [dealerGroup, setDealerGroup] = useState<string[]>([])
  const [dealerState, setDealerState] = useState<string[]>([])
  const [dealerBta, setDealerBta] = useState<string[]>([])
  const [dealerCity, setDealerCity] = useState<string[]>([])
  const [dealerCounty, setDealerCounty] = useState<string[]>([])
  const [dealerCountry, setDealerCountry] = useState<string[]>([])

  const opts = surveyFilterOptions

  return (
    <FilterGroupContainer
      groups={[
        {
          id: "rv-classification",
          label: "RV Classification",
          defaultOpen: true,
          content: (
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  RV Type
                </span>
                <CheckboxGroup options={opts.rvType} selected={rvType} onChange={setRvType} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Motorized or Towable
                </span>
                <CheckboxGroup options={opts.motorizedOrTowable} selected={motOrTow} onChange={setMotOrTow} />
              </div>
              <MultiSelect
                label="RV Subtype"
                options={toOptions(opts.rvSubtype)}
                selected={rvSubtype}
                onChange={setRvSubtype}
                placeholder="All Subtypes"
              />
            </div>
          ),
        },
        {
          id: "manufacturer-model",
          label: "Manufacturer & Model",
          defaultOpen: true,
          content: (
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  THOR Operating Company
                </span>
                <CheckboxGroup options={opts.thorOperatingCompany} selected={thorOpCo} onChange={setThorOpCo} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Model Year
                </span>
                <CheckboxGroup options={opts.modelYear} selected={modelYear} onChange={setModelYear} />
              </div>
              <MultiSelect
                label="RV Model"
                options={toOptions(opts.rvModel)}
                selected={rvModel}
                onChange={setRvModel}
                placeholder="All Models"
              />
            </div>
          ),
        },
        {
          id: "vehicle-specs",
          label: "Vehicle Specifications",
          defaultOpen: false,
          content: (
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Price Group
                </span>
                <CheckboxGroup options={opts.priceGroup} selected={priceGroup} onChange={setPriceGroup} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Chassis Model
                </span>
                <CheckboxGroup options={opts.chassisModel} selected={chassis} onChange={setChassis} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Gross Vehicle Weight
                </span>
                <CheckboxGroup options={opts.grossVehicleWeight} selected={gvw} onChange={setGvw} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Drive Type
                </span>
                <CheckboxGroup options={opts.driveType} selected={driveType} onChange={setDriveType} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Number of Axles
                </span>
                <CheckboxGroup options={opts.numberOfAxles} selected={axles} onChange={setAxles} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Is Rental
                </span>
                <CheckboxGroup options={opts.isRental} selected={isRental} onChange={setIsRental} />
              </div>
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Is THOR
                </span>
                <CheckboxGroup options={opts.isThor} selected={isThor} onChange={setIsThor} />
              </div>
            </div>
          ),
        },
        {
          id: "placement-geo",
          label: "Placement Geography",
          defaultOpen: false,
          content: (
            <div className="space-y-3">
              <MultiSelect
                label="Placement State"
                options={toOptions(opts.placementState)}
                selected={placementState}
                onChange={setPlacementState}
                placeholder="All States"
              />
              <MultiSelect
                label="Placement BTA"
                options={toOptions(opts.placementBta)}
                selected={placementBta}
                onChange={setPlacementBta}
                placeholder="All BTAs"
              />
              <MultiSelect
                label="Placement City"
                options={toOptions(opts.placementCity)}
                selected={placementCity}
                onChange={setPlacementCity}
                placeholder="All Cities"
              />
              <MultiSelect
                label="Placement County"
                options={toOptions(opts.placementCounty)}
                selected={placementCounty}
                onChange={setPlacementCounty}
                placeholder="All Counties"
              />
              <MultiSelect
                label="Placement Zip"
                options={toOptions(opts.placementZip)}
                selected={placementZip}
                onChange={setPlacementZip}
                placeholder="All Zip Codes"
              />
            </div>
          ),
        },
        {
          id: "dealership",
          label: "Dealership",
          defaultOpen: false,
          content: (
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Dealer Group
                </span>
                <CheckboxGroup options={opts.dealerGroup} selected={dealerGroup} onChange={setDealerGroup} />
              </div>
              <MultiSelect
                label="Dealership State"
                options={toOptions(opts.dealershipState)}
                selected={dealerState}
                onChange={setDealerState}
                placeholder="All States"
              />
              <MultiSelect
                label="Dealership BTA"
                options={toOptions(opts.dealershipBta)}
                selected={dealerBta}
                onChange={setDealerBta}
                placeholder="All BTAs"
              />
              <MultiSelect
                label="Dealership City"
                options={toOptions(opts.dealershipCity)}
                selected={dealerCity}
                onChange={setDealerCity}
                placeholder="All Cities"
              />
              <MultiSelect
                label="Dealership County"
                options={toOptions(opts.dealershipCounty)}
                selected={dealerCounty}
                onChange={setDealerCounty}
                placeholder="All Counties"
              />
              <div>
                <span className="mb-1.5 block font-heading text-[10px] font-bold uppercase tracking-wide text-dark-grey">
                  Dealership Country
                </span>
                <CheckboxGroup options={opts.dealershipCountry} selected={dealerCountry} onChange={setDealerCountry} />
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}
