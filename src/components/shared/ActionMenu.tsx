import { MoreHorizontal } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import type { ReactNode } from 'react';

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: 'left' | 'right';
}

export function ActionMenu({
  items,
  align = 'right',
}: ActionMenuProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="inline-block"
    >
      <Dropdown
        align={align}
        width={180}
        trigger={
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <MoreHorizontal size={16} />
          </button>
        }
      >
        {items.map((item, index) => (
          <div key={index}>
            {item.separator && <DropdownSeparator />}

            <DropdownItem
              icon={item.icon}
              danger={item.danger}
              onClick={(e: any) => {
                e?.stopPropagation?.();
                item.onClick();
              }}
            >
              {item.label}
            </DropdownItem>
          </div>
        ))}
      </Dropdown>
    </div>
  );
}