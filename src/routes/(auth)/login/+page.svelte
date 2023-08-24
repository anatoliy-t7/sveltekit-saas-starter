<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import Pincode from '$lib/components/Pincode.svelte';
	import PincodeInput from '$lib/components/PincodeInput.svelte';
	import Error from '$lib/components/Error.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	export let data;

	let otpView = false;
	let code: string[] = [];
	let value = '';
	let formOtp: HTMLFormElement;
	let sending = false;

	const { form, errors, enhance } = superForm(data.emailForm, {
		taintedMessage: null,
		onResult: ({ result }) => {
			otpView = true;
			message = '';
		}
	});

	const {
		form: otpForm,
		errors: otpErrors,
		enhance: otpEnhance,
		message: otpMessage
	} = superForm(data.otpForm, {
		taintedMessage: null
	});

	let message = 'You must be logged in to access this page';
	$: hasRedirect = $page.url.searchParams.get('redirectTo') ? true : false;

	$: if ($otpMessage) {
		toastStore.trigger($otpMessage);
	}

	$: if ($otpErrors.otp) {
		sending = false;
	}

	$: if ($otpErrors.email) {
		otpView = false;
		code = [];
		value = '';
	}
</script>

<div class="space-y-6 lg:w-80">
	{#if hasRedirect}
		<p class="alert">{message}</p>
	{/if}

	<div class="text-center pb-6">
		<h2 class="text-2xl font-medium text-slate-900 unstyled">Sign In / Register</h2>
	</div>

	{#if otpView}
		<div transition:slide>
			<form bind:this={formOtp} method="POST" action="?/checkOtp" use:otpEnhance class="space-y-6">
				<div class="text-slate-500 text-sm text-center">
					{#if $otpErrors.otp}
						<Error>{$otpErrors.otp}</Error>
					{:else}
						<div>
							We sent a 6 digit code to your
							<strong class="font-semibold">email address</strong>.
						</div>
					{/if}

					Please enter the code in order sign in.
				</div>
				<div class="flex justify-center">
					<input type="hidden" name="otp" bind:value={$otpForm.otp} />
					<input type="hidden" name="email" bind:value={$otpForm.email} />
					<Pincode
						type="numeric"
						bind:code
						bind:value
						on:complete={(e) => {
							$otpForm.otp = e.detail.value;
							$otpForm.email = $form.email;
							sending = true;
							setTimeout(() => {
								formOtp.dispatchEvent(new Event('submit', { bubbles: true }));
							}, 50);
						}}
					>
						<PincodeInput />
						<PincodeInput />
						<PincodeInput class="mr-4" />
						<PincodeInput />
						<PincodeInput />
						<PincodeInput />
					</Pincode>
				</div>

				<div class="flex justify-center px-2">
					<button
						disabled={value.length != 6 || sending}
						type="submit"
						class="btn variant-soft-primary w-full"
					>
						{#if sending}
							Verifying
						{:else}
							Verify
						{/if}
					</button>
				</div>
			</form>
		</div>
	{:else}
		<div transition:slide>
			<form method="POST" action="?/sendOtp" class="space-y-4" use:enhance>
				<label for="email" class="label">
					<span class="text-sm">Sign In via OTP on Email</span>
					<input
						bind:value={$form.email}
						aria-invalid={$errors.email ? 'true' : undefined}
						class="input"
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						placeholder="Email address"
						required
					/>
					{#if $otpErrors.email}
						<div class="text-center">
							<Error>{$otpErrors.email}</Error>
						</div>
					{/if}
					{#if $errors.email}
						<span class="text-sm text-red-600">
							{$errors.email}
						</span>
					{/if}
				</label>

				<button type="submit" class="btn variant-filled-primary w-full"> Sign In </button>
			</form>

			<div class="relative py-6">
				<div class="absolute inset-0 flex items-center" aria-hidden="true">
					<div class="w-full border-t border-gray-400"></div>
				</div>
				<div class="relative flex justify-center">
					<span class="bg-white px-6 text-slate-500 uppercase text-xs">or continue with</span>
				</div>
			</div>

			<div class="space-y-4">
				<a
					href="/login/google"
					aria-label="Continue with google"
					role="button"
					class="hover:bg-slate-50 p-2 border rounded-lg border-gray-400 block zoom-click"
				>
					<div class="flex items-center gap-2 pl-24">
						<svg class="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
							<path
								fill="#FFC107"
								d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
							/>
							<path
								fill="#FF3D00"
								d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
							/>
							<path
								fill="#4CAF50"
								d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
							/>
							<path
								fill="#1976D2"
								d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
							/>
						</svg>
						<p class="text-base font-medium text-gray-700">Google</p>
					</div>
				</a>

				<a
					href="/login/facebook"
					aria-label="Continue with facebook"
					role="button"
					class="hover:bg-slate-50 p-2 border rounded-lg border-gray-400 block zoom-click"
				>
					<div class="flex items-center gap-2 pl-24">
						<svg class="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
							<path
								fill="#1877F2"
								d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
							/>
							<path
								fill="#FFF"
								d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825"
							/>
						</svg>

						<p class="text-base font-medium text-gray-700">Facebook</p>
					</div>
				</a>
			</div>
		</div>
	{/if}

	<div class="text-xs text-slate-500 text-center">
		By clicking continue, you agree to our <a
			href="/terms-conditions"
			class="underline hover:text-slate-600">Terms of Service</a
		>
		and
		<a href="/privacy-policy" class="underline hover:text-slate-600">Privacy Policy</a>
		.
	</div>
</div>

<style>
	:global([data-pincode]) {
		display: flex;
		gap: 0.3rem;
	}

	:global([data-pincode] input) {
		font-size: 32px;
		width: 44px;
		padding: 10px;
		text-align: center;
		border-radius: 5px;
		border: 1px solid #334155;
		background: #f8fafc;
		font-weight: bold;
		color: #0f172a;
		outline: none;
		transition: all 0.1s;
	}

	:global([data-pincode] input:focus) {
		z-index: 1;
		border: 1px solid #06b6d4;
	}
</style>
