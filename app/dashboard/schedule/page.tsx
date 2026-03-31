"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CalendarDays, RefreshCw, Sparkles, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  generateScheduleInBackend,
  getScheduleContextFromBackend,
  rebuildScheduleForAbsenceInBackend,
} from "@/lib/api/backend"
import type { ScheduleDataset, ScheduleGenerationResult } from "@/lib/types/database"

export default function SchedulePage() {
  const [dataset, setDataset] = useState<ScheduleDataset | null>(null)
  const [schedule, setSchedule] = useState<ScheduleGenerationResult | null>(null)
  const [absentTeacherId, setAbsentTeacherId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState("")

  async function loadInitialData() {
    try {
      setIsLoading(true)
      setError("")
      const [contextData, scheduleData] = await Promise.all([
        getScheduleContextFromBackend(),
        generateScheduleInBackend(),
      ])
      setDataset(contextData)
      setSchedule(scheduleData)
      setAbsentTeacherId(contextData.teachers[0]?.id || "")
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load smart schedule.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadInitialData()
  }, [])

  async function handleGenerate() {
    try {
      setIsActionLoading(true)
      setError("")
      const generated = await generateScheduleInBackend()
      setSchedule(generated)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to generate schedule.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleRebuild() {
    if (!absentTeacherId) return

    try {
      setIsActionLoading(true)
      setError("")
      const rebuilt = await rebuildScheduleForAbsenceInBackend(absentTeacherId)
      setSchedule(rebuilt)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to rebuild schedule.")
    } finally {
      setIsActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Schedule</h1>
          <p className="text-slate-600">
            Conflict-free schedule generation with stream lessons and absence recovery.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void handleGenerate()} disabled={isActionLoading} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Schedule
          </Button>
          <div className="flex min-w-[280px] items-center gap-2">
            <Select value={absentTeacherId} onValueChange={setAbsentTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Select absent teacher" />
              </SelectTrigger>
              <SelectContent>
                {dataset?.teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => void handleRebuild()} disabled={isActionLoading || !absentTeacherId} className="gap-2">
              <UserX className="h-4 w-4" />
              Simulate Absence
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Constraints</CardTitle>
            <CardDescription>Classes, teachers, rooms, and grouped stream lessons.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>{dataset?.classes.length || 0} classes in the current demo dataset.</p>
            <p>{dataset?.teachers.length || 0} teachers with blocked slots and subject constraints.</p>
            <p>{dataset?.rooms.length || 0} rooms with features like labs and stage access.</p>
            <p>{dataset?.requirements.filter((item) => item.lesson_type === "stream").length || 0} stream lesson(s) split across parallel groups.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generation Result</CardTitle>
            <CardDescription>Current scheduling pass status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>{schedule?.summary || "No schedule generated yet."}</p>
            <p>{schedule?.entries.length || 0} scheduled entry/entries.</p>
            <p>{schedule?.unresolved_requirements.length || 0} unresolved requirement(s).</p>
            <p>{schedule?.changes.length || 0} adjustment(s) after absence simulation.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Explainable Logic</CardTitle>
            <CardDescription>How to present this on demo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>The engine avoids teacher, room, and class overlaps.</p>
            <p>Stream lessons place two parallel groups in the same slot with different teachers and rooms.</p>
            <p>When a teacher is marked absent, the schedule reassigns or flags unfilled lessons with explanations.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Generated Weekly Schedule</CardTitle>
            <CardDescription>Admin preview of the current auto-generated timetable.</CardDescription>
          </div>
          <CalendarDays className="h-5 w-5 text-slate-400" />
        </CardHeader>
        <CardContent className="space-y-4">
          {dataset?.slots.map((slot) => {
            const slotEntries = schedule?.entries.filter((entry) => entry.slot_id === slot) || []
            const [day, period] = slot.split("-P")

            return (
              <div key={slot} className="rounded-lg border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50">
                  <div className="font-medium text-slate-900">{day}</div>
                  <div className="text-sm text-slate-500">Period {period}</div>
                </div>
                <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {slotEntries.length > 0 ? (
                    slotEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-lg border px-4 py-3 text-sm ${
                          entry.status === "unfilled"
                            ? "border-red-200 bg-red-50"
                            : entry.status === "reassigned"
                              ? "border-amber-200 bg-amber-50"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{entry.class_name}</div>
                        <div className="text-slate-700">{entry.subject}</div>
                        {entry.group_label && (
                          <div className="text-xs text-slate-500">{entry.group_label}</div>
                        )}
                        <div className="mt-2 text-xs text-slate-500">
                          {entry.teacher_name || "No teacher assigned"} · {entry.room_name || "No room"}
                        </div>
                        {entry.note && (
                          <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{entry.note}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-400">No lessons assigned in this slot.</div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Conflicts</CardTitle>
            <CardDescription>Anything the scheduler could not place.</CardDescription>
          </CardHeader>
          <CardContent>
            {schedule?.unresolved_requirements.length ? (
              <div className="space-y-2">
                {schedule.unresolved_requirements.map((item) => (
                  <div key={item} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">All demo requirements were placed without conflicts.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Log</CardTitle>
            <CardDescription>What happened during absence simulation.</CardDescription>
          </CardHeader>
          <CardContent>
            {schedule?.changes.length ? (
              <div className="space-y-2">
                {schedule.changes.map((change) => (
                  <div key={`${change.entry_id}-${change.message}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {change.message}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No changes yet. Simulate an absent teacher to see automatic adjustments.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => void loadInitialData()} className="gap-2" disabled={isActionLoading}>
          <RefreshCw className="h-4 w-4" />
          Refresh Dataset
        </Button>
      </div>
    </div>
  )
}
