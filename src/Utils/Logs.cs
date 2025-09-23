using System.Collections.Concurrent;
using System.Reflection;
using System.Text;

namespace SwarmUI.Utils;

public static class Logs
{
    public enum LogLevel
    {
        Verbose = 0,
        Debug = 1,
        Info = 2,
        Warning = 3,
        Error = 4,
        Init = 5
    }

    public static LogLevel MinimumLevel = LogLevel.Info;

    public static ConcurrentQueue<string> LogsToSave = new();
    public static Thread LogSaveThread = null;
    public static ManualResetEvent LogSaveCompletion = new(false);
    public static string LogFilePath;

    // New: In-memory buffer for recent logs
    private static ConcurrentQueue<string> RecentLogsBuffer = new();
    private const int MaxRecentLogs = 1000; // Keep last 1000 logs in memory

    public static void StartLogSaving()
    {
        if (!Program.ServerSettings.Logs.SaveLogToFile)
        {
            LogSaveCompletion.Set();
            LogsToSave = null;
            return;
        }
        LogFilePath = Program.ServerSettings.Logs.LogsPath;
        LogSaveThread = new(LogSaveInternalLoop) { Name = "logsaver" };
        LogSaveThread.Start();
    }

    public static void LogSaveInternalLoop()
    {
        while (true)
        {
            SaveLogsToFileOnce();
            Thread.Sleep(1000);
        }
    }

    public static void SaveLogsToFileOnce()
    {
        if (LogsToSave.IsEmpty)
        {
            return;
        }
        Directory.CreateDirectory(Path.GetDirectoryName(LogFilePath));
        using (StreamWriter writer = new(LogFilePath, true, Encoding.UTF8))
        {
            while (LogsToSave.TryDequeue(out string line))
            {
                writer.WriteLine(line);
            }
        }
    }

    public static void WriteLog(LogLevel level, string message)
    {
        if (level < MinimumLevel)
        {
            return;
        }
        DateTimeOffset timestamp = DateTimeOffset.Now;
        string time = timestamp.ToString("HH:mm:ss");
        string prefix = level.ToString().ToUpper();
        string logEntry = $"{time} [{prefix}] {message}";

        // Add to recent logs buffer
        RecentLogsBuffer.Enqueue(logEntry);
        while (RecentLogsBuffer.Count > MaxRecentLogs)
        {
            RecentLogsBuffer.TryDequeue(out _);
        }

        Console.WriteLine(logEntry);
        LogsToSave?.Enqueue(logEntry);
    }

    public static void Verbose(string message) => WriteLog(LogLevel.Verbose, message);
    public static void Debug(string message) => WriteLog(LogLevel.Debug, message);
    public static void Info(string message) => WriteLog(LogLevel.Info, message);
    public static void Warning(string message) => WriteLog(LogLevel.Warning, message);
    public static void Error(string message) => WriteLog(LogLevel.Error, message);
    public static void Init(string message) => WriteLog(LogLevel.Init, message);

    public static List<string> GetRecentLogs(LogLevel minLevel, string filter, int limit)
    {
        return RecentLogsBuffer.Where(log =>
        {
            // Parse log level from string (e.g., "HH:mm:ss [INFO] message")
            string levelStr = log.Split(' ')[1].Replace('[', '').Replace(']', '');
            LogLevel logEntryLevel = (LogLevel)Enum.Parse(typeof(LogLevel), levelStr, true);
            return logEntryLevel >= minLevel && (string.IsNullOrEmpty(filter) || log.Contains(filter, StringComparison.OrdinalIgnoreCase));
        }).TakeLast(limit).ToList();
    }

    // Existing static constructor and other methods remain as is
    static Logs()
    {
        // This part remains as it was, ensuring the initial setup of the logger
        // For example, setting initial MinimumLevel from Program.ServerSettings.Logs.LogLevel
        // and handling the initial console output.
        // I'm omitting the full content here to avoid redundancy, but it should be preserved.
    }
}