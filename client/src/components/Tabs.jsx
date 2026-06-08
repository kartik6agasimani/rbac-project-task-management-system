import React from "react";
import clsx from "clsx";

const Tabs = ({ tabs, setSelected, children }) => {
  return (
    <div className='w-full'>
      <div className='flex gap-6 border-b border-gray-300'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            )}
            type='button'
          >
            {tab.icon}
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      <div className='w-full mt-4'>{children}</div>
    </div>
  );
};

export default Tabs;