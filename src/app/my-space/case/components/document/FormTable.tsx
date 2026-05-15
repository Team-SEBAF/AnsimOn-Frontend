'use client';

import { Controller } from 'react-hook-form';
import type {
  FieldValues,
  Path,
  Control,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';
import type { FormTableProps, CellConfig } from '@/types/document';
import { Checkbox } from '@/components/ui/checkbox';

/** cells 타입에 따라 grid-template-columns 계산
 * - label 셀: 128px 고정
 * - input / checkbox-group 셀: 1fr 균등
 */
function getGridTemplate(cells: CellConfig<FieldValues>[]): string {
  return cells.map((cell) => (cell.type === 'label' ? '128px' : '1fr')).join(' ');
}

/** 점(.)으로 연결된 path로 중첩 errors 객체에서 에러를 꺼냄 */
function getFieldError(errors: FieldErrors, path: string) {
  return path.split('.').reduce<unknown>((obj, key) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
    return undefined;
  }, errors);
}

const cellBase = 'flex min-h-18 items-center border-r border-b border-gray-200 px-4 py-6';

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('02')) {
    const num = d.slice(0, 10);
    if (num.length <= 2) return num;
    if (num.length <= 6) return `${num.slice(0, 2)}-${num.slice(2)}`;
    return `${num.slice(0, 2)}-${num.slice(2, 6)}-${num.slice(6)}`;
  }
  const num = d.slice(0, 11);
  if (num.length <= 3) return num;
  if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
}

function formatResidentNumber(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 6) return d;
  return `${d.slice(0, 6)}-${d.slice(6)}`;
}

const FORMATTERS: Record<string, (v: string) => string> = {
  phone: formatPhone,
  'resident-number': formatResidentNumber,
};

export function FormTable<T extends FieldValues>({
  rows,
  register,
  watch,
  control,
  errors = {},
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
                  <CheckboxGroupField
                    cell={cell}
                    control={control as Control<FieldValues>}
                    register={register as UseFormRegister<FieldValues>}
                    watch={watch as UseFormWatch<FieldValues>}
                  />
                </div>
              );
            }

            const fieldError = getFieldError(errors as FieldErrors, cell.name);
            const hasError = !!fieldError;
            const formatFn = cell.format ? FORMATTERS[cell.format] : undefined;
            const { onChange: rhfOnChange, ...restRegister } = register(
              cell.name as Path<T>,
              cell.rules as RegisterOptions<T, Path<T>>,
            );

            return (
              <div key={i} className={cellBase}>
                <div className="flex w-full items-center gap-1.5">
                  {cell.prefix && (
                    <span className="typo-heading-5 shrink-0 text-gray-500">{cell.prefix}</span>
                  )}
                  <input
                    {...restRegister}
                    onChange={(e) => {
                      if (formatFn) e.target.value = formatFn(e.target.value);
                      rhfOnChange(e);
                    }}
                    placeholder={cell.placeholder}
                    aria-invalid={hasError}
                    className="typo-body-7 w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
                  />
                  {hasError && (fieldError as { message?: string }).message && (
                    <p className="typo-body-8 text-error shrink-0">
                      {(fieldError as { message?: string }).message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function CheckboxGroupField({
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
    <div className="flex flex-col gap-3">
      {cell.items.map((item) => {
        const isChecked = watch(item.checkboxName);
        return (
          <div key={item.checkboxName} className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5">
              <Controller
                control={control}
                name={item.checkboxName}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <span className="typo-body-7 shrink-0 text-gray-700">{item.label}</span>
            </label>
            {item.fields?.map((f) => (
              <span key={f.name} className="flex items-center gap-1.5">
                <span className="typo-body-7 shrink-0 text-gray-500">{f.label}</span>
                {f.prefix && <span className="typo-body-7 shrink-0 text-gray-500">{f.prefix}</span>}
                <input
                  {...register(f.name)}
                  disabled={!isChecked}
                  className="typo-body-7 w-32 border-b border-gray-300 bg-transparent text-gray-900 outline-none disabled:text-gray-300"
                />
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
