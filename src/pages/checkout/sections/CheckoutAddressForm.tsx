import { AnimatePresence, motion } from 'framer-motion';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { ChevronDown, Loader2, MapPinHouse, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { toEnglishNumbers } from '@/utils/numberFormat';
import type { City, Province, SaveAddressRequest, UserAddress } from '@/utils/checkoutApi';

type TranslateFn = (key: string) => string | undefined;

interface CheckoutAddressFormProps {
  form: UseFormReturn<SaveAddressRequest>;
  provinces: Province[];
  cities: City[];
  provinceId: number;
  editingAddress: UserAddress | null;
  saving: boolean;
  showOptionalFields: boolean;
  isRTL: boolean;
  t: TranslateFn;
  onToggleOptionalFields: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CheckoutAddressForm({
  form,
  provinces,
  cities,
  provinceId,
  editingAddress,
  saving,
  showOptionalFields,
  isRTL,
  t,
  onToggleOptionalFields,
  onSave,
  onCancel,
}: CheckoutAddressFormProps) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = form;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="rounded-2xl border border-color-theme bg-color-for-layer-on-body p-4 shadow-dark-sm sm:p-6"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-color-theme pb-4">
        <div className="rounded-xl bg-first/10 p-2.5 text-first">
          <MapPinHouse className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-s-bold first-text-color">
          {editingAddress
            ? t('checkout.editAddress') || 'Edit Address'
            : t('checkout.addNewAddress') || 'Add New Address'}
        </h2>
      </div>

      <div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="checkout-first-name" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.firstName') || 'First Name'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'})</span>
            </label>
            <Input
              id="checkout-first-name"
              {...register('firstName')}
              required
              aria-invalid={!!errors.firstName}
              placeholder={t('checkout.firstNamePlaceholder') || 'Enter first name'}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.firstName.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-last-name" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.lastName') || 'Last Name'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'})</span>
            </label>
            <Input
              id="checkout-last-name"
              {...register('lastName')}
              required
              aria-invalid={!!errors.lastName}
              placeholder={t('checkout.lastNamePlaceholder') || 'Enter last name'}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.lastName.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-province" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.province') || 'Province'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'})</span>
            </label>
            <Controller
              name="provinceId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="checkout-province"
                  options={provinces.map((province) => ({
                    value: province.id,
                    label: province.name,
                  }))}
                  value={field.value ?? 0}
                  onChange={(value) => {
                    field.onChange(Number(value));
                    setValue('cityId', 0, { shouldDirty: true });
                  }}
                  placeholder={t('checkout.selectProvince') || 'Select Province'}
                  searchPlaceholder={t('checkout.searchProvince') || 'Search provinces...'}
                  emptyMessage={t('checkout.noProvincesFound') || 'No provinces found'}
                  error={!!errors.provinceId}
                  className={errors.provinceId ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.provinceId?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.provinceId.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-city" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.city') || 'city'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'})</span>
            </label>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="checkout-city"
                  options={cities.map((city) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder={t('checkout.selectCity') || 'Select City'}
                  searchPlaceholder={t('checkout.searchCity') || 'Search cities...'}
                  emptyMessage={t('checkout.noCitiesFound') || 'No cities found'}
                  disabled={provinceId <= 0}
                  error={!!errors.cityId}
                  className={errors.cityId ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.cityId?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.cityId.message)}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="checkout-street" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.streetAddress') || 'Address Description'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'}</span>)
            </label>

            <textarea
              id="checkout-street"
              {...register('streetAddress1')}
              rows={3}
              aria-invalid={!!errors.streetAddress1}
              placeholder={t('checkout.streetAddressPlaceholder') || 'Enter address description'}
              className={`w-full resize-y rounded-xl border bg-input-surface px-3.5 py-3 text-sm first-text-color placeholder:first-text-color-for-paragraph-low transition-[border-color,box-shadow] focus:border-first focus:outline-none focus:ring-2 focus:ring-first/20 ${
                errors.streetAddress1 ? 'border-red-500' : 'border-color-theme'
              }`}
            />

            {errors.streetAddress1?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.streetAddress1.message)}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="checkout-postal-code" className="mb-2 flex items-center text-sm font-medium first-text-color">
              <span className="me-1">{t('checkout.postalCode') || 'Postal Code'}</span>(
              <span className="first-text-color-red">{t('checkout.required') || 'required'})</span>
            </label>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <Input
                  id="checkout-postal-code"
                  {...field}
                  type="tel"
                  dir="ltr"
                  aria-invalid={!!errors.postalCode}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={field.value ?? ''}
                  onChange={(event) => {
                    const onlyNumbers = toEnglishNumbers(event.target.value).replace(/\D/g, '');
                    field.onChange(onlyNumbers);
                  }}
                  placeholder={t('checkout.postalCodePlaceholder') || 'Enter postal code'}
                  className="text-right"
                />
              )}
            />
            {errors.postalCode?.message && (
              <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.postalCode.message)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={onToggleOptionalFields}
          aria-expanded={showOptionalFields}
          className="flex w-full items-center justify-between rounded-xl border border-color-theme bg-color-for-layer-sec px-4 py-3 transition-colors hover:border-first/35 hover:bg-color-for-layer-three focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-first" />
            <span className="text-sm font-semibold first-text-color-for-paragraph">
              {t('checkout.optionalInformation') || 'Optional Information'}
            </span>
          </div>

          <motion.div
            animate={{ rotate: showOptionalFields ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="h-4 w-4 first-text-color-for-paragraph-low" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {showOptionalFields && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                <div>
                  <label htmlFor="checkout-address-title" className="mb-2 flex items-center text-sm font-medium first-text-color">
                    {t('checkout.addressTitle') || 'Address Title'}
                  </label>
                  <Input
                    id="checkout-address-title"
                    {...register('title')}
                    placeholder={
                      t('checkout.addressTitlePlaceholder') || 'e.g., Home, Work, Office'
                    }
                  />
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="mb-2 flex items-center text-sm font-medium first-text-color">
                    {t('checkout.phoneNumber') || 'Phone Number'}
                  </label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="checkout-phone"
                        {...field}
                        type="tel"
                        dir="ltr"
                        aria-invalid={!!errors.phoneNumber}
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(toEnglishNumbers(event.target.value))}
                        placeholder={t('checkout.phoneNumberPlaceholder') || 'Enter phone number'}
                        className="text-right"
                      />
                    )}
                  />
                  {errors.phoneNumber?.message && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{String(errors.phoneNumber.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-alternative-phone" className="mb-2 flex items-center text-sm font-medium first-text-color">
                    {t('checkout.alternativePhoneNumber') || 'Alternative Phone Number'}
                  </label>
                  <Controller
                    name="alternativePhoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="checkout-alternative-phone"
                        {...field}
                        type="tel"
                        dir="ltr"
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(toEnglishNumbers(event.target.value))}
                        placeholder={t('checkout.alternativePhoneNumberPlaceholder') || 'Optional'}
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="checkout-street-2" className="mb-2 flex items-center text-sm font-medium first-text-color">
                    {t('checkout.streetAddress2') || 'Street Address 2'}
                  </label>
                  <Input
                    id="checkout-street-2"
                    {...register('streetAddress2')}
                    placeholder={
                      t('checkout.streetAddress2Placeholder') || 'Apartment, suite, etc.'
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-color-theme pt-5 mt-6 sm:flex-nowrap">
        <Button
          type="submit"
          disabled={saving}
          className="group relative w-full items-center rounded-xl bg-first px-4 py-2 text-white hover:bg-first-600"
          size="md"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              {t('common.loading') || 'Loading...'}
            </>
          ) : (
            <>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('checkout.saveAddress') || 'Save Address'}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border border-color-theme first-text-color hover:bg-color-for-layer-sec"
          onClick={onCancel}
        >
          {t('checkout.cancel') || 'Cancel'}
        </Button>
      </div>
    </motion.form>
  );
}
