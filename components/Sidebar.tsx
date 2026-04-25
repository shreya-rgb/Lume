"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  Check,
  X,
  Sparkles,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, truncate } from "@/lib/utils";
import type { ChatSession } from "@/types";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: s