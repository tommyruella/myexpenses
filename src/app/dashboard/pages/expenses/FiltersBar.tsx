import React from "react";
import { MdSwapVert } from "react-icons/md";
import { FaTshirt, FaUtensils, FaBus, FaUsers, FaPiggyBank, FaQuestionCircle, FaGlobe, FaGift } from "react-icons/fa";
import "./expensespage.css";

interface FiltersBarProps {
  search: string;
  setSearch: (val: string) => void;
  filterCat: string;
  setFilterCat: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  categories: string[];
}

export default function FiltersBar({
  search,
  setSearch,
  filterCat,
  setFilterCat,
  filterType,
  setFilterType,
  categories,
}: FiltersBarProps) {
    return (
    <div style={{marginBottom: 20, boxSizing: 'border-box'}}>
      <input
        placeholder="Search…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFilterType("");
          setFilterCat("");
        }}
        style={{
          display: "flex",
          width: "100%",
          padding: "12px",
          margin: "0 0 14px 0",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          boxSizing: "border-box",
        }}
      />

      <div className="filters-bar">
        {/* Tipologia */}
        <div style={{ position: "relative", width: "100%" }}>
          <MdSwapVert
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#555",
              width: 15,
              height: 15,
              minWidth: 15,
              minHeight: 15,
              maxWidth: 16,
              maxHeight: 16,
            }}
          />
          <select
            value={filterType}
            onChange={(e) => {
              const val = e.target.value;
              setFilterType(val);
              setSearch("");
              setFilterCat("");
              if (val === "ENTRATA") setFilterCat("");
            }}
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 15,
              appearance: "none",
              background: "white",
            }}
          >
            <option value="">All expenses</option>
            <option value="USCITA">Only OUT</option>
            <option value="ENTRATA">Only IN</option>
          </select>
        </div>

        {/* Categoria */}
        <div style={{ position: "relative", width: "100%" }}>
          {(() => {
            const iconProps = {
              size: 15,
              style: {
                position: "absolute" as const,
                top: "50%",
                left: 12,
                transform: "translateY(-50%)",
                pointerEvents: undefined,
                color: "#555",
                width: 15,
                height: 15,
                minWidth: 15,
                minHeight: 15,
                maxWidth: 16,
                maxHeight: 16,
              }
            };
            switch (filterCat) {
              case "CLOTH": return <FaTshirt {...iconProps} />;
              case "FOOD": return <FaUtensils {...iconProps} />;
              case "TRANSPORT": return <FaBus {...iconProps} />;
              case "TRAVEL": return <FaGlobe {...iconProps} />;
              case "HANGOUT": return <FaUsers {...iconProps} />;
              case "EARNINGS": return <FaPiggyBank {...iconProps} />;
              case "OTHERS": return <FaGift {...iconProps} />;
              case "": return <FaQuestionCircle {...iconProps} />;
              default: return <FaQuestionCircle {...iconProps} />;
            }
          })()}
          <select
            value={filterCat}
            onChange={(e) => {
              setFilterCat(e.target.value);
              setSearch("");
              setFilterType("");
            }}
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 15,
              appearance: "none",
              background: "white",
            }}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
