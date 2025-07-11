"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Slider } from "@workspace/ui/components/slider";
import { cn } from "@workspace/ui/lib/utils";
import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";

type Props = {
  testid?: string;
  /**
   * プレビュー領域の横幅
   */
  width?: string | number;
  /**
   * 画像のアスペクト比
   * */
  aspectRatio?: number;
  /**
   * クロップ後の横幅
   * */
  resultWidth: number;
  /**
   * 画像の値
   */
  value: string | null | undefined;
  /**
   * 画像が変更された時のコールバック関数
   */
  onChange: (value: string) => void;
  /**
   * 入力画像の最大サイズ
   * デフォルトは4MB
   */
  maxSize?: number;
};

export function InputImage({
  width = "100%",
  aspectRatio = 1,
  maxSize = 1024 * 1024 * 4, // 4MB
  resultWidth,
  value = "",
  onChange,
}: Props) {
  const editor = useRef<AvatarEditor>(null);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    maxSize,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    useFsAccessApi: false,
    onDropAccepted: (dropped) => {
      setImage(dropped[0]);
      setScale(1.0);
      setOpen(true);
    },
  });
  const [image, setImage] = useState<File>();
  const [scale, setScale] = useState<number | undefined>(1.0);
  const [open, setOpen] = useState(false);

  const cropImage = async () => {
    const dataUrl = editor.current?.getImage().toDataURL("image/jpeg");
    const result = await resizeBase64Img(
      dataUrl!,
      resultWidth,
      resultWidth / aspectRatio
    );
    setOpen(false);
    onChange(result);
  };

  return (
    <div>
      <div className="relative w-fit">
        <div
          className={cn(
            "border overflow-hidden cursor-pointer rounded-md grid place-content-center relative",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none ring-offset-background",
            isDragAccept ? "bg-primary scale-150" : "bg-muted"
          )}
          style={{
            aspectRatio,
            width,
          }}
          {...getRootProps()}
        >
          {!value && (
            <ImagePlus className="size-8 text-muted-foreground opacity-30" />
          )}
          {value && (
            <img className="object-cover size-full" src={value} alt="" />
          )}
          <input {...getInputProps()} />
          <span className="sr-only">画像を選択</span>
        </div>

        {value && (
          <Button
            type="button"
            variant="outline"
            className="absolute top-2 right-2 size-8 text-muted-foreground"
            size="icon"
            onClick={() => {
              onChange("");
            }}
          >
            <X size={20} />
            <span className="sr-only">イメージを削除</span>
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={(status) => setOpen(status)}>
        <DialogTitle className="sr-only">イメージを切り抜く</DialogTitle>
        <DialogContent className="max-w-md">
          <div
            className="border relative overflow-hidden rounded-lg"
            style={{
              aspectRatio,
            }}
          >
            {image && (
              <AvatarEditor
                className="absolute max-w-full max-h-full inset-0"
                scale={scale}
                ref={editor}
                width={1000}
                height={1000 / aspectRatio}
                image={image}
              />
            )}
          </div>

          <div className="my-4">
            <Slider
              max={2}
              step={0.01}
              min={1}
              defaultValue={[1]}
              onValueChange={([value]) => setScale(value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">閉じる</Button>
            </DialogClose>
            <Button autoFocus onClick={cropImage}>
              切り取る
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function resizeBase64Img(base64: string, width: number, height: number) {
  return new Promise<string>((resolve, reject) => {
    const img = document.createElement("img");

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg"));
    };

    img.onerror = function (err) {
      reject(err);
    };

    img.src = base64;
  });
}
