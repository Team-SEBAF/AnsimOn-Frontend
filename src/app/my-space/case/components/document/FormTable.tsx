'use client';

import { Controller } from 'react-hook-form';
import type { FieldValues, Path, Control, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { FormTableProps, CellConfig } from '@/types/document';
import { Checkbox } from '@/components/ui/checkbox';

/** cells 타입에 따라 grid-template-columns 계산
 * - label 셀: 128px 고정
 * - input / checkbox-group 셀: 1fr 균등
 */
function getGridTemplate(cells: CellConfig[]): string {
  return cells.map((cell) => (cell.type === 'label' ? '128px' : '1fr')).join(' ');
}

const cellBase = 'flex min-h-18 items-center border-r border-b border-gray-200 px-4 py-6';

export function FormTable<T extends FieldValues>({
  rows,
  register,
  watch,
  control,
}: FormTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border-t border-l border-gray-200">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid"
          style={{ gridTemplateColumns: getGridTemplate(row.cells) }}
        >
          {row.cells.map((cell, i) => {
            if (cell.type === 'label') {
              return (
                <div
                  key={i}
                  className="flex min-h-18 flex-col justify-center border-r border-b border-gray-200 bg-gray-50 py-6 pl-4"
                >
                  <p className="typo-heading-5 whitespace-pre text-gray-500">{cell.text}</p>
                  {cell.subText && <p className="typo-body-8 text-gray-500">{cell.subText}</p>}
                </div>
              );
            }

            if (cell.type === 'checkbox-group') {
              return (
                <div key={i} className={cellBase}>
                  <AgentField
                    cell={cell}
                    control={control as Control<FieldValues>}
                    register={register as UseFormRegister<FieldValues>}
                    watch={watch as UseFormWatch<FieldValues>}
                  />
                </div>
              );
            }

            return (
              <div key={i} className={cellBase}>
                <div className="flex w-full items-center gap-1.5">
                  {cell.prefix && (
                    <span className="typo-heading-5 shrink-0 text-gray-500">{cell.prefix}</span>
                  )}
                  <input
                    {...register(cell.name as Path<T>)}
                    placeholder={cell.placeholder}
                    className="typo-body-7 w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function AgentField({
  cell,
  control,
  register,
  watch,
}: {
  cell: Extract<CellConfig, { type: 'checkbox-group' }>;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {cell.items.map((item) => {
        const checked = watch(item.checkboxName);
        return (
          <label key={item.checkboxName} className="flex items-center gap-1.5">
            <Controller
              control={control}
              name={item.checkboxName}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <span className="typo-body-7 text-gray-700">{item.label}</span>
            {item.fields.map((f) => (
              <span key={f.name} className="flex items-center gap-1">
                <span className="typo-body-7 text-gray-500">{f.label}</span>
                <input
                  {...register(f.name)}
                  disabled={!checked}
                  className="typo-body-7 w-28 border-b border-gray-300 bg-transparent text-gray-900 outline-none disabled:text-gray-300"
                />
              </span>
            ))}
          </label>
        );
      })}
    </div>
  );
}
