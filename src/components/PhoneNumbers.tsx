import { cn } from '@/lib/utils';
import { MaterialIcon } from '@/components/MaterialIcon';

export interface PhoneNumber {
  number: string;
  label?: string;
  type: 'phone' | 'fax';
}

interface PhoneNumbersProps {
  phones: PhoneNumber[];
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showLabels?: boolean;
}

const PhoneNumbers = ({
  phones,
  className = '',
  iconClassName = '',
  textClassName = '',
  showLabels = false,
}: PhoneNumbersProps) => {
  if (!phones || phones.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-1', className)}>
      {phones.map((phone, index) => {
        const cleanNumber = phone.number.replace(/\s+/g, '');
        const href = phone.type === 'fax' ? `fax:${cleanNumber}` : `tel:${cleanNumber}`;

        return (
          <a
            key={index}
            href={href}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2',
              'text-sm text-primary-foreground/70 transition-colors duration-200',
              'hover:bg-primary-foreground/8 hover:text-primary-foreground',
              textClassName,
            )}
          >
            <MaterialIcon
              name={phone.type === 'fax' ? 'print' : 'call'}
              size={20}
              className={cn('flex-shrink-0 opacity-80 group-hover:opacity-100', iconClassName)}
            />
            <div className="flex flex-col">
              {showLabels && phone.label && (
                <span className="text-[11px] font-medium uppercase tracking-wide text-primary-foreground/50">
                  {phone.label}
                </span>
              )}
              <span className="font-normal ltr-nums">{phone.number}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default PhoneNumbers;
