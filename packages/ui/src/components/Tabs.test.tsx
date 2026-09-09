import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs Component', () => {
  it('renders tabs with defaultValue and shows corresponding panel', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList ariaLabel="Test Tabs">
          <TabsTrigger value="tab1">Account</TabsTrigger>
          <TabsTrigger value="tab2">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Account Details Panel</TabsContent>
        <TabsContent value="tab2">Password Change Panel</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole('tab', { name: /account/i });
    const tab2 = screen.getByRole('tab', { name: /password/i });

    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByText('Account Details Panel')).toBeVisible();
    expect(screen.getByText('Password Change Panel')).not.toBeVisible();
  });

  it('switches active tab on click in uncontrolled mode', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1 Content</TabsContent>
        <TabsContent value="tab2">Panel 2 Content</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    act(() => {
      fireEvent.click(tab2);
    });

    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel 2 Content')).toBeVisible();
    expect(screen.getByText('Panel 1 Content')).not.toBeVisible();
  });

  it('respects controlled value and fires onValueChange', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1 Content</TabsContent>
        <TabsContent value="tab2">Panel 2 Content</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    act(() => {
      fireEvent.click(tab2);
    });

    expect(onValueChange).toHaveBeenCalledWith('tab2');
    // In controlled mode, panel doesn't switch until prop updates
    expect(screen.getByText('Panel 1 Content')).toBeVisible();

    rerender(
      <Tabs value="tab2" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1 Content</TabsContent>
        <TabsContent value="tab2">Panel 2 Content</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Panel 2 Content')).toBeVisible();
  });

  it('does NOT switch tab when clicking a disabled tab', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Active Tab</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Disabled Tab
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Active Panel</TabsContent>
        <TabsContent value="tab2">Disabled Panel</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByRole('tab', { name: /disabled tab/i });
    expect(tab2).toBeDisabled();

    act(() => {
      fireEvent.click(tab2);
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText('Active Panel')).toBeVisible();
  });

  it('supports automatic keyboard navigation (ArrowRight, ArrowLeft, Home, End)', () => {
    render(
      <Tabs defaultValue="tab1" activationMode="automatic">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1</TabsContent>
        <TabsContent value="tab2">Panel 2</TabsContent>
        <TabsContent value="tab3">Panel 3</TabsContent>
      </Tabs>
    );

    const tabList = screen.getByRole('tablist');
    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });
    const tab3 = screen.getByRole('tab', { name: /tab 3/i });

    tab1.focus();

    // ArrowRight -> Tab 2
    act(() => {
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    });
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel 2')).toBeVisible();

    // End -> Tab 3
    act(() => {
      fireEvent.keyDown(tab2, { key: 'End' });
    });
    expect(tab3).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel 3')).toBeVisible();

    // Home -> Tab 1
    act(() => {
      fireEvent.keyDown(tab3, { key: 'Home' });
    });
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel 1')).toBeVisible();
  });

  it('supports vertical orientation keyboard navigation (ArrowDown, ArrowUp)', () => {
    render(
      <Tabs defaultValue="tab1" orientation="vertical" activationMode="automatic">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1</TabsContent>
        <TabsContent value="tab2">Panel 2</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });

    tab1.focus();

    act(() => {
      fireEvent.keyDown(tab1, { key: 'ArrowDown' });
    });
    expect(tab2).toHaveAttribute('aria-selected', 'true');

    act(() => {
      fireEvent.keyDown(tab2, { key: 'ArrowUp' });
    });
    expect(tab1).toHaveAttribute('aria-selected', 'true');
  });

  it('supports manual activation mode with Space and Enter', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" activationMode="manual" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1</TabsContent>
        <TabsContent value="tab2">Panel 2</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });

    tab1.focus();

    // In manual mode, arrow key moves focus but doesn't change active tab
    act(() => {
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    });
    expect(onValueChange).not.toHaveBeenCalled();

    // Press Enter to activate focused tab2
    act(() => {
      fireEvent.keyDown(tab2, { key: 'Enter' });
    });
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('unmounts hidden content when lazy={true}', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" lazy>
          Lazy Panel 1
        </TabsContent>
        <TabsContent value="tab2" lazy>
          Lazy Panel 2
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Lazy Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Lazy Panel 2')).not.toBeInTheDocument();
  });
});
